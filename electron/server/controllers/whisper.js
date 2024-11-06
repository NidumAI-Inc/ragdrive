import express from 'express';
import { promises as fsPromise } from 'fs';

import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  convertToCaptions,
} from "../whisper";

import { getWhisperPath } from '../utils/path-helper.js';
import { upload } from "../middleawres/upload.js";

const router = express.Router()

router.post("/download", async (req, res) => {
  try {
    const { model } = req.body

    const modelSize = {
      "tiny": 78643200,
      "tiny.en": 78643200,
      "base": 148897792,
      "base.en": 148897792,
      "small": 488636416,
      "small.en": 488636416,
      "medium": 1572864000,
      "medium.en": 1572864000,
      "large-v1": 3113851904,
      "large-v2": 3113851904,
      "large-v3": 3113851904
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    const sendProgress = (message) => res.write(`data: ${JSON.stringify(message)}\n\n`)

    const whisperPath = getWhisperPath()

    sendProgress({ stage: 'install', name: "Whisper" })
    await installWhisperCpp({
      to: whisperPath,
      version: "1.5.5",
      printOutput: false,
    })
    sendProgress({ stage: 'install', name: "Whisper" })

    sendProgress({ stage: 'download', name: model, progress: 0 })
    await downloadWhisperModel({
      model,
      folder: whisperPath,
      printOutput: false,
      onProgress(r) {
        let progress = Math.ceil((r / modelSize[model]) * 100)
        sendProgress({ stage: 'download', name: model, progress })
      }
    })
    sendProgress({ stage: 'download', name: model, progress: 100 })

  } catch (error) {
    sendProgress({ stage: 'error', error: error.message })
  } finally {
    res.end()
  }
})

router.post("/transcribe/:folderName/:model", upload.single('audio'), async (req, res) => {
  try {
    const { model } = req.params;
    if (!model) return res.status(400).json({ error: "Model parameter is required" })
    if (!req.file) return res.status(400).json({ error: "No audio file uploaded" })

    const whisperPath = getWhisperPath()
    const { transcription } = await transcribe({
      tokenLevelTimestamps: false,
      inputPath: req.file.path,
      whisperPath,
      model,
      printOutput: false,
      tmpJSONDir: whisperPath,
    })

    const { captions } = convertToCaptions({
      combineTokensWithinMilliseconds: 200,
      transcription,
    })

    const transcribed = captions?.map(cap => cap.text).join(' ')

    return res.json({ transcribed })

  } catch (error) {
    console.error("Error in /transcribe route:", error)
    return res.status(500).json({
      error: "An error occurred during transcription",
      details: error.message
    })
  }
})

router.delete("/", async (req, res) => {
  try {
    const whisperPath = getWhisperPath()
    await fsPromise.rm(whisperPath, { recursive: true, force: true })
    return res.json({ msg: "Whisper folder deleted successfully" })

  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
