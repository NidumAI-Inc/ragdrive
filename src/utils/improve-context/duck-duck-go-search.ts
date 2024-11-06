import axios from "axios";
import constants from "../constants";

async function duckDuckGoSerach(text: string) {
  try {
    return await axios.get(`${constants.backendUrl}/duckduckgo?text=${text}`).then(d => d.data)
  } catch (error) {
    return []
  }
}

export default duckDuckGoSerach