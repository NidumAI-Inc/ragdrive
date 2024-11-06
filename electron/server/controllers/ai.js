import express from 'express';

const router = express.Router()

router.post("/sambanova", async (req, res) => {
  try {
    const { apiKey, stream, ...rest } = req.body

    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({ ...rest, stream: false })
    })

    const data = await response.json()
    res.json(data)

  } catch (error) {
    // console.log(error)
    res.status(500).json({ error: error.message })
  }
})

export default router