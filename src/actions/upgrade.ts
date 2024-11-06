import constants from "../utils/constants";
import axios from "axios";

export async function installLatestDMG(fileName: string) {
  return axios.get(`${constants.backendUrl}/upgrade/install-dmg?fileName=${fileName}`).then(r => r.data)
}

export async function isLatestVersionAvailable() {
  return axios.get(`${constants.backendUrl}/upgrade/is-latest-version-available`).then(r => r.data)
}
