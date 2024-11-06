import { PlaywrightCrawler } from 'crawlee'; // Dataset
import fs from 'fs/promises';

import { createPath } from './path-helper';
import logger from './logger';

async function crawle({ url, maxRequestsPerCrawl = 50, folderName }) {
  try {
    const resultPath = createPath([folderName, "result.txt"]);
    let data = []
    // const dataset = await Dataset.open(createPath([folderName]))

    const crawler = new PlaywrightCrawler({
      async requestHandler({ request, page, enqueueLinks, log }) {
        // const title = await page.title()
        const content = await page.evaluate(() => {
          const body = document.body;
          return body.innerText;
        })

        // await dataset.pushData({ title, url: request.loadedUrl, content })
        data.push(content)
        await enqueueLinks()
      },
      maxRequestsPerCrawl,
    })

    await crawler.run([url])

    await fs.mkdir(createPath([folderName]), { recursive: true })
    await fs.writeFile(resultPath, JSON.stringify(data?.join("/n"), null, 2))

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    throw error
  }
}

export default crawle