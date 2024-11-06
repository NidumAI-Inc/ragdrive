import { promisify } from 'util';
import { pipeline } from 'stream';
import https from 'https';
import fs from 'fs/promises';

const streamPipeline = promisify(pipeline)

async function downloadFile(url, destination) {
  const fileStream = await fs.open(destination, 'w')
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`))
        return
      }

      streamPipeline(response, fileStream.createWriteStream())
        .then(resolve)
        .catch(reject)
    }).on('error', err => {
      reject(err)
    })
  })
}

export default downloadFile
