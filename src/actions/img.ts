import useContextStore from "../store/context";
import constants from "../utils/constants";
import axios from "axios";

function getFolderName() {
  const chat_id = useContextStore.getState().chat_id
  return `img_${chat_id}`
}

const imgToBase64Mapped: any = {}
export async function imgToBase64(imgName: string) {
  try {
    const folderName = getFolderName()
    if (imgToBase64Mapped[`${folderName}_${imgName}`]) return imgToBase64Mapped[`${folderName}_${imgName}`]

    const { data } = await axios.get(`${constants.backendUrl}/image/to-base64/${folderName}/${imgName}`)
    if (data?.converted) {
      imgToBase64Mapped[`${folderName}_${imgName}`] = data?.converted
      return data?.converted
    }
    return ""

  } catch (error) {
    // console.log(error)
    return ""
  }
}

export async function setImgToBase64Map(imgName: string, data: string) {
  const folderName = getFolderName()
  imgToBase64Mapped[`${folderName}_${imgName}`] = data
}

export async function uploadImg(files: File[]) {
  try {
    const folderName = getFolderName()
    const formData = new FormData()
    files.forEach(file => formData.append("images", file))
    return axios.post(`${constants.backendUrl}/image/${folderName}`, formData).then(r => r.data)

  } catch (error) {
    // console.log(error)
  }
}

export type generateImgT = {
  url: string
  apiKey: string
  inputs: string
  fileName: string
}

export async function generateImg(data: generateImgT) {
  return axios.post(`${constants.backendUrl}/image/generate`, data)
}

export async function downloadGenerateImg(fileName: string) {
  return axios.post(`${constants.backendUrl}/image/download-generated-img`, { fileName })
}

export async function deleteImg(fileName: string) {
  const folderName = getFolderName()
  return axios.delete(`${constants.backendUrl}/image/${folderName}/${fileName}`).then(r => r.data)
}
