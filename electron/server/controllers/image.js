import express from 'express';
import { promises as fs } from 'fs';
import imageToBase64 from 'image-to-base64';
import axios from 'axios';
import path from 'path';
import os from 'os';

import { checkIsDirExists, createPath } from "../utils/path-helper.js";
import { upload } from "../middleawres/upload.js";

const router = express.Router()

router.get('/:folderName/:imageName', async (req, res) => {
  const { folderName, imageName } = req.params
  const imagePath = createPath([folderName, imageName])

  res.sendFile(imagePath, (err) => {
    if (err) return res.status(404).json({ msg: 'Image not found' })
  })
})

router.get('/to-base64/:folderName/:imageName', async (req, res) => {
  const { folderName, imageName } = req.params
  const imagePath = createPath([folderName, imageName])

  try {
    const converted = await imageToBase64(imagePath)
    return res.json({ converted })
  } catch (error) {
    return res.status(404).json({ msg: "cannot convert into base64" })
  }
})

router.post("/generate", async (req, res) => {
  try {
    const { url, inputs, apiKey, fileName } = req.body
    checkIsDirExists(createPath(["img_gen"]))

    const response = await axios({
      url,
      method: 'post',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      data: { inputs },
      responseType: 'arraybuffer',
    })

    const filePath = createPath(["img_gen", fileName]);
    await fs.writeFile(filePath, response.data)
    return res.json({ msg: "Generated" })

  } catch (error) {
    // console.log(error)
    return res.status(400).json({ error })
  }
})

router.post("/download-generated-img", async (req, res) => {
  try {
    const { fileName } = req.body
    const filePath = createPath(["img_gen", fileName]);
    const targetPath = path.join(os.homedir(), 'Downloads', fileName);
    await fs.copyFile(filePath, targetPath)
    return res.json({ msg: "downloaded" })

  } catch (error) {
    // console.log(error)
    return res.status(400).json({ error })
  }
})

router.post("/:folderName", upload.array('images'), async (req, res) => {
  try {
    return res.json({ msg: "image stored" })

  } catch (error) {
    // console.log(error)
    return res.status(400).json({ error })
  }
})

router.delete("/:folderName/:filename", async (req, res) => {
  try {
    const { folderName, filename } = req.params
    const filePath = createPath([folderName, filename])

    await fs.unlink(filePath)

    return res.json({ msg: "image deleted" })

  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
