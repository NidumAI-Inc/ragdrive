import { resolveModelFile } from "node-llama-cpp";
import { promises as fs } from 'fs';
import express from 'express';

import { createPath } from '../utils/path-helper';

const router = express.Router()

router.get("/model-path/:selectedModel", async (req, res) => {
  try {
    const { selectedModel } = req.params

    const modelPath = createPath(["models", selectedModel])
    return res.json({ modelPath })

  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.get("/downloaded-models", async (req, res) => {
  try {
    const modelJson = createPath(["models", "downloaded.json"])

    try {
      await fs.access(modelJson)
      const data = await fs.readFile(modelJson, "utf8")

      return res.json(JSON.parse(data))

    } catch (error) {
      if (error.code === 'ENOENT') {
        const defaultData = []

        try {
          await fs.writeFile(modelJson, JSON.stringify(defaultData, null, 2));
          return res.json([])

        } catch (writeError) {
          console.error('Error creating file:', writeError);
        }
      } else {
        console.error('Error accessing file:', error);
        return res.status(500).json({ error })
      }
    }

  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.post("/", async (req, res) => {
  try {
    const { id, model, fileName } = req.body

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await resolveModelFile(
      model,
      {
        fileName,
        directory: createPath(["models"]),
        onProgress(status) {
          let progress = +Number((status.downloadedSize / status.totalSize) * 100).toFixed()
          res.write(`data: ${JSON.stringify({ progress, id })}\n\n`);
        }
      }
    );

    const modelJson = createPath(["models", "downloaded.json"])
    const oldData = await fs.readFile(modelJson)
    const parsed = JSON.parse(oldData)
    let newData = [...parsed]
    const index = newData.findIndex(f => f.fileName === fileName)
    if (index < 0) {
      newData.push({
        id,
        fileName,
      })
    }
    await fs.writeFile(modelJson, JSON.stringify(newData))

    res.write(`data: ${JSON.stringify({ progress: 100 })}\n\n`);
    res.end();

  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.delete("/downloaded-model/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params

    const modelJson = createPath(["models", "downloaded.json"])

    await fs.rm(createPath(["models", fileName]))
    const oldData = await fs.readFile(modelJson)
    const parsed = JSON.parse(oldData)
    let newData = [...parsed].filter(f => f.fileName !== fileName)
    await fs.writeFile(modelJson, JSON.stringify(newData))
    return res.json({ msg: "success" })

  } catch (error) {
    return res.status(500).json({ error })
  }
})

export default router
