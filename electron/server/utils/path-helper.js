import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import os from 'os';

const homeDirectory = os.homedir()

const mainPath = ".nidum"

export function getRoot() {
  return path.join(homeDirectory, mainPath)
}

export function createPath(newPath = []) {
  return path.join(getRoot(), ...newPath)
}

export function getRagPath(newPath = "") {
  return createPath([newPath, "index-store"])
}

export function getWhisperPath() {
  return createPath(["whisper"])
}

export function checkIsDirExists(directoryPath = "") {
  if (!existsSync(directoryPath)) {
    try {
      mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory created: ${directoryPath}`);
      return false

    } catch (err) {
      console.error(`Error creating directory: ${err.message}`);
      return false
    }

  } else {
    console.log(`Directory already exists: ${directoryPath}`);
    return true
  }
}

function modelsPathCheck() {
  const modelsPath = createPath(["models"])

  const modelAlreadyExits = checkIsDirExists(modelsPath)
  if (!modelAlreadyExits) {
    writeFileSync(createPath(["models", "downloaded.json"]), JSON.stringify([]))
  }
}

export function checkPathsSetup() {
  const directoryPath = getRoot()
  checkIsDirExists(directoryPath)
  modelsPathCheck()
}