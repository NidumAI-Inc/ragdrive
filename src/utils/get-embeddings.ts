import useContextStore from "../store/context";

interface EmbeddingResponse {
  embedding: number[]
}

async function getEmbeddings(prompt: string): Promise<number[]> {
  const { embedding_type, ollamEmbeddingUrl, ollamaEmbeddingModel } = useContextStore.getState()

  const model = embedding_type === "Ollama" ? ollamaEmbeddingModel : "mxbai-embed-large"
  const url = embedding_type === "Ollama" ? `${ollamEmbeddingUrl}/api/embeddings` : "https://ollamaemb.tunnelgate.haive.tech/api/embeddings"

  const response = await fetch(url, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as EmbeddingResponse;
  return data.embedding;
}

export default getEmbeddings
