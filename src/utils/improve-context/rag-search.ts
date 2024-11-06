import axios from "axios";

import useContextStore from "../../store/context";
import constants from "../../utils/constants";

async function ragSearch(query: string) {
  const project_id = useContextStore.getState().project_id
  const { data } = await axios.get(`${constants.backendUrl}/doc/${project_id}/?query=${query}`)
  return data?.map((d: any) => d?.text)?.join(",")
}

export default ragSearch
