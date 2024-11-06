import axios from "axios";

import constants from "../utils/constants";

export async function deleteWhisperFolder() {
  return axios.delete(`${constants.backendUrl}/whisper`).then(r => r.data)
}