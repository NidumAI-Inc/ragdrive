import multer from "multer";
import fs from 'fs';

import { createPath } from "../utils/path-helper.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = createPath([req.params.folderName])
    fs.mkdirSync(uploadDir, { recursive: true, mode: 0o777 })
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage: storage })

export const uploadMemory = multer({ storage: multer.memoryStorage() })
