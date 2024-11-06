import { getLlama, LlamaChatSession } from "node-llama-cpp";
import express from 'express';

import { createPath } from "../utils/path-helper";

const router = express.Router()

router.post("/", async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const { modelName, messages, message } = req.body

    const llama = await getLlama()
    const model = await llama.loadModel({
      modelPath: createPath(["models", modelName])
    })

    const context = await model.createContext()
    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    })

    session.setChatHistory(messages)

    await session.prompt(message, {
      onTextChunk: reply => {
        res.write(`data: ${JSON.stringify({ reply })}\n\n`)
      }
    })

    res.end()

  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: "Something bad" })}\n\n`)
    return res.end()
  }
})

export default router
