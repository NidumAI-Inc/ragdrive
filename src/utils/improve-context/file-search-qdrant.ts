// import { QdrantClient } from '@qdrant/js-client-rest';

import getEmbeddings from "../get-embeddings";
import useContextStore from '../../store/context';

async function fileSearchQdrant(text: string, collectionName: string) {
  const vector = await getEmbeddings(text)

  const { qdrantDBApiKey, qdrantDBUrl, vb_type } = useContextStore.getState()
  const nidum_url = "https://c69b-164-52-211-150.ngrok-free.app"
  const nidum_apiKey = "admin123"

  // const client = new QdrantClient({ url: 'http://164.52.211.150:6334' })
  // const res = await client?.search(collectionName, {
  //   vector,
  // })
  const url = vb_type === "Nidum" ? nidum_url : qdrantDBUrl
  const apiKey = vb_type === "Nidum" ? nidum_apiKey : qdrantDBApiKey
  const limit = 12

  const response = await fetch(`${url}/collections/${collectionName}/points/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey || "admin123"
    },
    body: JSON.stringify({
      limit,
      vector,
      with_payload: true
    }),
  })

  const res = await response.json()
  return res?.result?.map((r: any) => r?.payload?.text || "")?.join(" ")
}

export default fileSearchQdrant
