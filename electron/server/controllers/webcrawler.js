import express from 'express';
import ogs from 'open-graph-scraper';
import fs from 'fs/promises';

import { getSublinks, crawlWebsite, convertUrlsToFilenames } from '../utils/crawler';
import { indexFolder } from '../utils/llama';
import { createPath } from '../utils/path-helper';
import logger from '../utils/logger';

const router = express.Router()

router.get('/metadata', async (req, res) => {
  const { url } = req.query

  if (!url) return res.status(400).json({ error: 'No URL provided' })

  try {
    const decoded = decodeURIComponent(url)
    const { result, error } = await ogs({ url: decoded })

    if (error) {
      // throw new Error("Error on getting data")
      return res.json({})
    }

    let baseUrl = result?.ogUrl ? new URL(result?.ogUrl) : {}

    let payload = {
      title: result?.ogTitle || result?.twitterTitle,
      description: result?.ogDescription || result?.twitterDescription,
      siteName: result?.ogSiteName || baseUrl?.hostname,
      favicon: result?.favicon ?
        !result?.favicon?.startsWith("http") ? baseUrl?.origin + result?.favicon : result?.favicon
        : result?.ogImage?.[0]?.url || "",
    }
    return res.json(payload)

  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch metadata' })
  }
})

router.get("/get-crawled-list/:folderName", async (req, res) => {
  try {
    const { folderName } = req.params
    const filePath = createPath(["crawled", `${folderName}.json`])

    try {
      const fileData = await fs.readFile(filePath, 'utf8')
      return res.json(JSON.parse(fileData))

    } catch (error) {
      return res.json([])
    }
  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post('/get-metadata', async (req, res) => {
  const { urls } = req.body

  try {
    const metadataPromises = urls.map(async (url) => {
      try {
        const { result, error } = await ogs({
          url,
          onlyGetOpenGraphInfo: [
            "title", "description", "favicon", "image", "logo"
          ],
        })

        if (error) return { url }

        let baseUrl = result?.ogUrl ? new URL(result?.ogUrl) : {}

        return {
          title: result?.ogTitle || result?.twitterTitle,
          description: result?.ogDescription || result?.twitterDescription,
          siteName: result?.ogSiteName || baseUrl?.hostname,
          favicon: result?.favicon ?
            result?.favicon?.startsWith("/") ? baseUrl?.origin + result?.favicon : result?.favicon
            : result?.ogImage?.[0]?.url || "",
          url,
        }
      } catch (error) {
        return { url }
      }
    })

    const final = await Promise.all(metadataPromises)
    final.sort((a, b) => Object.values(a).length > Object.values(b).length)
    return res.json(final)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Unable to fetch metadata' })
  }
})

router.post("/get-links", async (req, res) => {
  try {
    const { url, excludedLinks, maxRequestsPerCrawl } = req.body

    const links = await getSublinks({ url, excludedLinks, maxRequestsPerCrawl })
    return res.json({ links })

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/crawle", async (req, res) => {
  try {
    const { urls, folderName } = req.body
    await crawlWebsite({ urls, folderName })

    await indexFolder({ folderName })

    return res.json({ msg: "Saved successfully" })

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/delete", async (req, res) => {
  try {
    const { urls, folderName } = req.body

    for await (const url of urls) {
      const base = convertUrlsToFilenames(url) || "root"
      const fileParh = createPath([folderName, `${base}.txt`])
      try {
        await fs.unlink(fileParh)

      } catch (error) {
      }
    }

    const content = []
    const filePath = createPath(["crawled", `${folderName}.json`])

    try {

      const fileData = await fs.readFile(filePath, 'utf8');
      let data = JSON.parse(fileData)
      if (data && Array.isArray(data)) {
        content.push(...data)
      }
    } catch (err) {
      console.log("file is not exists", err)
    }

    let finalContents = content.filter(cont => !urls.includes(cont))
    await fs.writeFile(filePath, JSON.stringify(finalContents, null, 2), 'utf8');

    await indexFolder({ folderName })

    return res.json({ msg: "Saved successfully" })

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

export default router