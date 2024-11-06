import { chromium } from 'playwright';
import fs from 'fs/promises';
import axios from 'axios';
import fsn from 'fs';
import os from 'os';

import { createPath, getRoot } from './path-helper';
import downloadFile from './download-file';
import runCommand from './run-command';
import logger from './logger';

function normalizeUrl(url) {
  try {
    const normalizedUrl = new URL(url)
    if (normalizedUrl.pathname !== '/') {
      normalizedUrl.pathname = normalizedUrl.pathname.replace(/\/$/, '')
    }
    return normalizedUrl.href
  } catch (error) {
    console.error(`Invalid URL encountered: ${url}`)
    return url
  }
}

export function convertUrlsToFilenames(url) {
  const urlObject = new URL(url)

  let pathname = urlObject.pathname.replace(/^\/|\/$/g, '')

  let filename = pathname.replace(/\//g, '_')

  return filename
}

function filterAndCleanUrls(urls) {
  const filteredUrls = new Set();

  urls.forEach(url => {
    const parsedUrl = new URL(url);

    parsedUrl.hash = '';

    filteredUrls.add(parsedUrl.href);
  })

  return Array.from(filteredUrls);
}

async function extractSublinks(page, url) {
  let sublinks = []

  try {
    const linkElements = await page.locator('a').all()
    const allLinks = await Promise.all(linkElements.map(el => el.getAttribute('href')))

    sublinks = allLinks
      .filter(link => link && (link.startsWith('/') || link.startsWith(url)))
      .map(link => {
        if (link.startsWith('/')) return new URL(link, url).href
        return link
      })
      .map(normalizeUrl)

    sublinks = [...new Set(sublinks)]

  } catch (error) {
    console.error(`Error extracting sublinks from ${url}: ${error.message}`)
  }

  return sublinks
}

export async function getSublinks({ url, excludedLinks = [], maxRequestsPerCrawl = 5 }) {
  try {
    const visitedUrls = new Set()
    const urlsToVisit = [normalizeUrl(url)]
    const excludedNormalized = new Set(excludedLinks.map(normalizeUrl))

    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    const allSublinks = new Set()
    let requestCount = 0

    while (urlsToVisit.length > 0 && requestCount < maxRequestsPerCrawl) {
      const currentUrl = urlsToVisit.shift()
      const normalizedUrl = normalizeUrl(currentUrl)

      if (visitedUrls.has(normalizedUrl) || excludedNormalized.has(normalizedUrl)) continue
      visitedUrls.add(normalizedUrl)

      try {
        await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded' })
        requestCount++;

        const sublinks = await extractSublinks(page, normalizedUrl)
        sublinks.forEach(link => {
          if (!visitedUrls.has(normalizeUrl(link)) && !excludedNormalized.has(normalizeUrl(link))) {
            allSublinks.add(link)
          }
        })

        if (requestCount < maxRequestsPerCrawl) {
          urlsToVisit.push(...sublinks.filter(link => !visitedUrls.has(normalizeUrl(link)) && !excludedNormalized.has(normalizeUrl(link))))
        }

      } catch (error) {
        console.error(`Failed to crawl ${normalizedUrl}: ${error.message}`)
      }
    }

    await browser.close()

    const final = [...allSublinks]
    return filterAndCleanUrls(final)

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    console.log(error)
    return []
  }
}

async function checkCloudflareHeaders(url) {
  try {
    const response = await axios.get(url)

    const isCloudflare = response.headers['server'] && response.headers['server'].includes('cloudflare')
    const hasCfRay = response.headers['cf-ray'] !== undefined

    if (isCloudflare || hasCfRay) return true
    return false

  } catch (error) {
    return true
  }
}

async function checkPageStatus(url) {
  try {
    await axios.get(url, { maxRedirects: 0 })
    return false
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403 || error.response.status === 503) {
        return true
      }
    }
    return false
  }
}

async function handleBotVerification(page, url, attempt = 1) {
  await page.waitForTimeout(5000)

  // const waitUntilOption = attempt === 1 ? 'domcontentloaded' : 'networkidle';
  // await page.goto(url, { waitUntil: waitUntilOption })

  const challengeResolved = await page.evaluate(() => {
    return !document.body.innerText.includes('Just a moment...') &&
      document.querySelector('script[src*="/cdn-cgi/challenge-platform/"]') === null;
  })

  if (challengeResolved) {
    return await page.innerText('body')
  }

  if (attempt < 3) {
    return await handleBotVerification(page, url, attempt + 1)
  }

  return ""
}

async function crawlPage(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const check1 = await page.evaluate(() => {
    return document.body.innerText.includes('Just a moment...') ||
      document.querySelector('script[src*="/cdn-cgi/challenge-platform/"]') !== null
  })

  if (check1 || await checkPageStatus(url) || await checkCloudflareHeaders(url)) {
    const content = await handleBotVerification(page, url)
    if (!content) throw Error("This site is protected, and we are unable to scrape it at the moment.")
    return content
  }

  return await page.innerText('body')
}

export async function crawlWebsite({ urls, folderName }) {
  const opSys = os.platform()
  const INSTALL_DIR = getRoot()
  let CHROMIUM_EXEC = opSys === "win32" ? createPath(['chrome-win', 'chrome.exe']) : createPath(['chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'])
  const zipPath = createPath(["chromium.zip"])

  if (!fsn.existsSync(CHROMIUM_EXEC)) {
    let PUPPETEER_URL = ""
    const architecture = os.arch()

    if (opSys === "darwin") {
      if (architecture.includes("arm")) {
        PUPPETEER_URL = 'https://commondatastorage.googleapis.com/chromium-browser-snapshots/Mac_Arm/1371887/chrome-mac.zip'
      } else {
        PUPPETEER_URL = 'https://commondatastorage.googleapis.com/chromium-browser-snapshots/Mac/1371812/chrome-mac.zip'
      }
    }
    else if (opSys === "win32") {
      PUPPETEER_URL = 'https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Win_x64%2F1371882%2Fchrome-win.zip?generation=1729586716608171&alt=media'
    }

    if (PUPPETEER_URL) {
      await downloadFile(PUPPETEER_URL, zipPath)
      await runCommand(`unzip ${zipPath} -d ${INSTALL_DIR}`)
      await runCommand(`rm ${zipPath}`)
      await runCommand(`chmod +x "${CHROMIUM_EXEC}"`)
    }
  }

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXEC
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  await fs.mkdir(createPath([folderName]), { recursive: true })
  await fs.mkdir(createPath(["crawled"]), { recursive: true })

  for await (const url of urls) {
    const normalizedUrl = normalizeUrl(url)

    const content = await crawlPage(page, normalizedUrl)
    const base = convertUrlsToFilenames(url) || "root"

    const resultPath = createPath([folderName, `${base}.txt`])
    await fs.writeFile(resultPath, JSON.stringify(content, null, 2))
  }

  await browser.close()
  const filePath = createPath(["crawled", `${folderName}.json`])
  const content = [...urls]

  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    let data = JSON.parse(fileData)
    if (data && Array.isArray(data)) {
      content.push(...data)
    }

  } catch (err) {
    console.log("file is not exists", err)
  }

  let finalContents = [...new Set(content)]
  await fs.writeFile(filePath, JSON.stringify(finalContents, null, 2), 'utf8');
}
