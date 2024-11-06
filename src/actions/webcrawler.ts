import constants from "../utils/constants";
import axios from "axios";

export async function getCrawledLinks(projectId: string) {
  return axios.get(`${constants.backendUrl}/web-crawler/get-crawled-list/${projectId}`).then(r => r.data)
}

export async function getLinkPreview(url: string) {
  return axios.get(`${constants.backendUrl}/web-crawler/metadata?url=${encodeURIComponent(url)}`).then(r => r.data)
}

type payT = {
  url: string
  excludedLinks: string
  maxRequestsPerCrawl: string
}
export async function getSubLinks(payload: payT) {
  return axios.post(`${constants.backendUrl}/web-crawler/get-links`, payload).then(r => r.data)
}

type payloadT = {
  urls: string[]
  folderName: string
}
export async function crawleWeb(payload: payloadT) {
  return axios.post(`${constants.backendUrl}/web-crawler/crawle`, payload).then(r => r.data)
}

export async function deletedCrawledLinks(payload: payloadT) {
  return axios.post(`${constants.backendUrl}/web-crawler/delete`, payload).then(r => r.data)
}

