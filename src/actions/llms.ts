import axios from "axios";
import constants from "../utils/constants";

export async function getLLMModels(llm: string) {
  return axios.get(`https://raw.githubusercontent.com/NidumAI-Inc/catalog/main/${llm}-models.json`).then(r => r.data)
}

export async function getModelPath(path: string) {
  return axios.get(`${constants.backendUrl}/llama/model-path/${path}`).then(r => r.data)
}

export async function getLLamaDownloadedModels() {
  return axios.get(`${constants.backendUrl}/llama/downloaded-models`).then(r => r.data)
}

export async function deleteDownloadedModel(fileName: string) {
  return axios.delete(`${constants.backendUrl}/llama/downloaded-model/${fileName}`).then(r => r.data)
}
