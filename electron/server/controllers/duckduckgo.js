import express from 'express';
import { text as duckduckgoSearch } from '../utils/duckduckgo-search';

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const text = req.query.text

    const results = []

    let fetchedCount = 0
    let limit = 20

    for await (const result of duckduckgoSearch(text)) {
      results.push(result)
      fetchedCount++

      if (fetchedCount >= limit) {
        break;
      }
    }

    return res.json(results)

  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
