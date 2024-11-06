import { spawn } from 'node:child_process';
import fs, { existsSync } from 'node:fs';

import { getWhisperExecutablePath } from './install-whisper-cpp.js';
import { getModelPath } from './download-whisper-model.js';
import { createPath } from '../utils/path-helper.js';

const isWavFile = (inputPath) => {
  const splitted = inputPath.split('.');
  if (!splitted) {
    return false;
  }
  return splitted[splitted.length - 1] === 'wav';
};

const readJson = async (jsonPath) => {
  const data = await fs.promises.readFile(jsonPath, 'utf8');
  return JSON.parse(data);
};

// https://github.com/ggerganov/whisper.cpp/blob/fe36c909715e6751277ddb020e7892c7670b61d4/examples/main/main.cpp#L989-L999
// https://github.com/remotion-dev/remotion/issues/4168
export const modelToDtw = (model) => {
  if (model === 'large-v3') {
    return 'large.v3';
  }
  if (model === 'large-v2') {
    return 'large.v2';
  }
  if (model === 'large-v1') {
    return 'large.v1';
  }
  return model;
};

const transcribeToTemporaryFile = async ({
  fileToTranscribe,
  whisperPath,
  model,
  tmpJSONPath,
  modelFolder,
  translate,
  tokenLevelTimestamps,
  printOutput,
  tokensPerItem,
  language,
  signal,
  onProgress,
}) => {
  const modelPath = getModelPath(modelFolder ?? whisperPath, model);
  if (!fs.existsSync(modelPath)) {
    throw new Error(`Error: Model ${model} does not exist at ${modelFolder ? modelFolder : modelPath}. Check out the downloadWhisperModel() API at https://www.remotion.dev/docs/install-whisper-cpp/download-whisper-model to see how to install whisper models`);
  }
  const executable = getWhisperExecutablePath(whisperPath);
  const args = [
    '-f',
    fileToTranscribe,
    '--output-file',
    tmpJSONPath,
    '--output-json',
    tokensPerItem ? ['--max-len', tokensPerItem] : null,
    '-ojf', // Output full JSON
    tokenLevelTimestamps ? ['--dtw', modelToDtw(model)] : null,
    model ? [`-m`, `${modelPath}`] : null,
    ['-pp'], // print progress
    translate ? '-tr' : null,
    language ? ['-l', language.toLowerCase()] : null,
  ]
    .flat(1)
    .filter(Boolean);

  const outputPath = await new Promise((resolve, reject) => {
    const task = spawn(executable, args, {
      cwd: whisperPath,
      signal: signal ?? undefined,
    });
    const predictedPath = `${tmpJSONPath}.json`;
    let output = '';
    const onData = (data) => {
      const str = data.toString('utf-8');
      const hasProgress = str.includes('progress =');
      if (hasProgress) {
        const progress = parseFloat(str.split('progress =')[1].trim());
        onProgress?.(progress / 100);
      }
      output += str;
      // Sometimes it hangs here
      if (str.includes('ggml_metal_free: deallocating')) {
        task.kill();
      }
    };
    const onStderr = (data) => {
      onData(data);
      if (printOutput) {
        process.stderr.write(data.toString('utf-8'));
      }
    };
    const onStdout = (data) => {
      onData(data);
      if (printOutput) {
        process.stdout.write(data.toString('utf-8'));
      }
    };
    task.stdout.on('data', onStdout);
    task.stderr.on('data', onStderr);
    task.on('exit', (code, exitSignal) => {
      // Whisper sometimes files also with error code 0
      // https://github.com/ggerganov/whisper.cpp/pull/1952/files
      if (existsSync(predictedPath)) {
        resolve(predictedPath);
        onProgress?.(1);
        return;
      }
      if (exitSignal) {
        reject(new Error(`Process was killed with signal ${exitSignal}: ${output}`));
        return;
      }
      reject(new Error(`No transcription was created (process exited with code ${code}): ${output}`));
    });
  });
  return { outputPath };
};

export const transcribe = async ({
  inputPath,
  whisperPath,
  model,
  modelFolder,
  translateToEnglish = false,
  tokenLevelTimestamps,
  printOutput = true,
  tokensPerItem,
  language,
  signal,
  onProgress,
}) => {
  if (!existsSync(whisperPath)) {
    throw new Error(`Whisper does not exist at ${whisperPath}. Double-check the passed whisperPath. If you havent installed whisper, check out the installWhisperCpp() API at https://www.remotion.dev/docs/install-whisper-cpp/install-whisper-cpp to see how to install whisper programatically.`);
  }
  if (!existsSync(inputPath)) {
    throw new Error(`Input file does not exist at ${inputPath}`);
  }
  if (!isWavFile(inputPath)) {
    throw new Error('Invalid inputFile type. The provided file is not a wav file!');
  }
  const tmpJSONDir = createPath(["temp"])
  const { outputPath: tmpJSONPath } = await transcribeToTemporaryFile({
    fileToTranscribe: inputPath,
    whisperPath,
    model,
    tmpJSONPath: tmpJSONDir,
    modelFolder: modelFolder ?? null,
    translate: translateToEnglish,
    tokenLevelTimestamps,
    printOutput,
    tokensPerItem: tokenLevelTimestamps ? 1 : tokensPerItem ?? 1,
    language: language ?? null,
    signal: signal ?? null,
    onProgress: onProgress ?? null,
  });
  const json = (await readJson(tmpJSONPath));
  fs.unlinkSync(tmpJSONPath);
  return json;
};