
export const executableNames = {
  darwin: "nidum",
  linux: "nidum",
  win32: "nidum.exe",
}

export const executabeCommand = {
  darwin: (fullPath) => `OLLAMA_HOST=127.0.0.1:11490 ${fullPath} serve`,
  linux: (fullPath) => `OLLAMA_HOST=127.0.0.1:11490 ${fullPath} serve`,
  win32: (binPath, fullPath) => `set OLLAMA_MODELS=${binPath} && ${fullPath} serve`,
}
