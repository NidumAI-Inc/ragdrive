export const downloadFile = async ({
  fileStream,
  url,
  printOutput,
  onProgress,
  signal,
}) => {
  const { body, headers } = await fetch(url, {
    signal,
  });

  const contentLength = headers.get('content-length');

  if (body === null) {
    throw new Error('Failed to download whisper model');
  }

  if (contentLength === null) {
    throw new Error('Content-Length header not found');
  }

  let downloaded = 0;
  let lastPrinted = 0;
  const totalFileSize = parseInt(contentLength, 10);
  const reader = body.getReader();

  // eslint-disable-next-line no-async-promise-executor
  await new Promise(async (resolve, reject) => {
    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (value) {
          downloaded += value.length;
          if (printOutput &&
            (downloaded - lastPrinted > 1024 * 1024 * 10 ||
              downloaded === totalFileSize)) {
            console.log(`Downloaded ${downloaded} of ${contentLength} bytes (${((downloaded / Number(contentLength)) *
              100).toFixed(2)}%)`);
            lastPrinted = downloaded;
          }
          fileStream.write(value, () => {
            onProgress?.(downloaded, totalFileSize);
            if (downloaded === totalFileSize) {
              fileStream.end();
              resolve();
            }
          });
        }
        if (done) {
          break;
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};