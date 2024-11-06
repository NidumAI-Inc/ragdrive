// import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import express from 'express';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import os from 'os';
import extract from 'extract-zip';
// import { app } from 'electron';

import { executabeCommand, executableNames } from '../utils/executables.js';
import { createPath, getRoot } from '../utils/path-helper.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const router = express.Router();

async function checkOllamaRunning(port) {
  try {
    await axios.get(`http://127.0.0.1:${port}`, { timeout: 1000 });
    return true;
  } catch (error) {
    return false;
  }
}

async function runOllama(res) {
  const executable = executableNames[os.platform()] || executableNames.darwin;
  const exePath = createPath([executable])

  if (!fs.existsSync(exePath)) {
    const url = 'https://releases.nidum.ai/download/downloads/bin.zip';
    // const url = "https://sample-videos.com/zip/10mb.zip"
    const zipPath = path.join(os.tmpdir(), 'nidum.zip')
    const extractPath = getRoot()

    const response = await axios({
      url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(zipPath);
    let downloadedBytes = 0;
    const totalBytes = parseInt(response.headers['content-length'], 10);

    response.data.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      const progress = Math.min(Math.round((downloadedBytes / totalBytes) * 100), 99)
      res.write(`data: ${JSON.stringify({ status: 'downloading', progress })}\n\n`);
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    await new Promise((res) => setTimeout(res, 2000))

    await extract(zipPath, { dir: extractPath })

    fs.unlinkSync(zipPath);
    await new Promise((res) => setTimeout(res, 4000))

    res.write(`data: ${JSON.stringify({ status: 'completed', progress: 100 })}\n\n`);
  }

  fs.chmodSync(exePath, '755');

  const cmdFn = executabeCommand[os.platform()] || executabeCommand.darwin;
  const binPath = createPath(["models"])
  const cmd = cmdFn(binPath, exePath);

  const ollamaProcess = exec(cmd, (error) => {
    if (error) {
      console.error('Execution error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  });

  ollamaProcess.on('spawn', () => {
    res.write(`data: ${JSON.stringify({ status: 'running' })}\n\n`);
    res.end();
  });
}

router.get('/', async (req, res) => {
  try {
    const isRunning = await checkOllamaRunning(11490);
    if (isRunning) {
      res.write(`data: ${JSON.stringify({ status: 'running' })}\n\n`);
      res.end();
      return;
    }
    return runOllama(res);
  } catch (error) {
    console.error('Download failed:', error);
    res.write(`data: ${JSON.stringify({ error: 'Download failed' })}\n\n`);
    res.end();
  }
});

export default router;
