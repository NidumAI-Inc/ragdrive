import { createWriteStream } from 'fs';
import { exec } from 'child_process';
import express from 'express';
import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import util from 'util'
import os from 'os';

import packageJson from '../../../package.json';

import isLatestSemantic from '../utils/is-latest-semantic.js'
import { createPath } from '../utils/path-helper';

const router = express.Router()

const execPromise = util.promisify(exec);

router.get('/is-latest-version-available', async (req, res) => {
  try {
    const currentVersion = packageJson.version
    const { data } = await axios.get("https://raw.githubusercontent.com/NidumAI-Inc/catalog/main/versions.json")
    const latestVersion = data?.[os.platform()] || data?.darwin

    if (!latestVersion) return res.json({ hasLatest: false })

    let payload = {
      hasLatest: isLatestSemantic(currentVersion, latestVersion),
    }

    if (payload.hasLatest) {
      payload.url = data?.[`${os.platform()}Url`] || data?.darwinUrl
    }

    return res.json(payload)

  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.get('/dowload-dmg', async (req, res) => {
  try {
    const { url } = req.query;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await axios({
      url,
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        res.write(`data: ${JSON.stringify({ progress: percentCompleted })}\n\n`);
      }
    })

    const fileName = path.basename(url);
    const filePath = createPath([fileName]);
    const writer = createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on('finish', () => {
      res.write(`data: ${JSON.stringify({ progress: 100 })}\n\n`)
      res.end()
    })

    writer.on('error', (error) => {
      res.status(500).json({ error: error.message })
    })

  } catch (error) {
    res.status(500).json({ error })
  }
})

router.get('/install-dmg', async (req, res) => {
  try {
    const { fileName } = req.query
    const filePath = createPath([fileName])

    // log(`DMG file downloaded successfully to ${filePath}`);

    const { stdout: mountOutput } = await execPromise(`hdiutil attach "${filePath}"`);
    // log(`Mount output: ${mountOutput}`);

    const mountLines = mountOutput.split('\n');
    const mountLine = mountLines.find(line => line.includes('/Volumes/'));
    if (!mountLine) throw new Error('Failed to find mount point in hdiutil output')

    const mountDir = mountLine.split('\t').pop().trim();
    // log(`DMG mounted at: ${mountDir}`);

    if (!mountDir) {
      throw new Error('Failed to extract mount directory from hdiutil output');
    }

    // log('Searching for .app directory');
    const files = await fs.readdir(mountDir);
    const appFile = files.find(file => file.endsWith('.app'));

    if (!appFile) {
      throw new Error('No .app file found in the mounted DMG');
    }

    const appPath = path.join(mountDir, appFile);
    // log(`Found application: ${appPath}`);

    // log('Copying application to /Applications');
    await execPromise(`cp -R "${appPath}" /Applications/`);
    // log('Application copied successfully');

    // log('Unmounting DMG');
    await execPromise(`hdiutil detach "${mountDir}"`);
    // log('DMG unmounted successfully');

    // Clean up the downloaded file
    // await fs.unlink(filePath);
    // log(`Downloaded DMG file deleted: ${filePath}`);

    res.json({ msg: "success" })

  } catch (error) {
    console.log(error)
    // log(`Error in install-dmg process: ${error.message}`, 'ERROR');
    res.status(500).send('Error: ' + error.message);
  }
})

export default router
