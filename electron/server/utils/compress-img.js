import sharp from 'sharp';
import fs from 'fs';

import { createPath } from './path-helper';

const compressAndSave = async (file, folderName) => {
  const uploadDir = createPath([folderName])
  fs.mkdirSync(uploadDir, { recursive: true, mode: 0o777 })

  const filepath = createPath([folderName, file.originalname])
  const fileCompSize = 100 * 1024 // 100 kb

  if (file.size > fileCompSize) {
    await sharp(file.buffer)
      .resize(320)
      .jpeg({ quality: 80 })
      .toFile(filepath)
  } else {
    await fs.promises.writeFile(filepath, file.buffer)
  }

  return file.originalname
}

export default compressAndSave
