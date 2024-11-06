export { default as duckDuckGoSerach } from "./duck-duck-go-search";
export { default as fileSearchQdrant } from "./file-search-qdrant";
export { default as ragSearch } from "./rag-search";

export const systemDefaultPrompt = "You are a helpful assistant."
export const ragDefaultPrompt = "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If the context does not contain the answer, then answer on your own. If the user asks a general question, you need to answer. "
export const webDefaultPrompt = "Efficiently search the web to gather up-to-date information on a wide range of topics. Retrieve information based on the user's query and any contextual information provided during the conversation, ensuring the response is personalized and relevant to their needs. Provide detailed answers based on reputable sources, summarizing key points succinctly. Prioritize sources that are trustworthy, well-known, and authoritative. If multiple perspectives exist, present a balanced view by including varied opinions or findings. Respect user privacy and ensure that sensitive or personal data is never logged or retained. Always cite your sources transparently in the form of links or references. Your responses should be clear, well-structured, and concise, with actionable insights when needed. If real-time information is required, such as for weather or stock updates, ensure the details are accurate and relevant to the user's location or context. "

export type prompt = {
  base?: string,
  context?: string
}

export function createContext({ base, context }: prompt) {
  const list = []

  if (base) list.push(base)

  if (context) list.push(
    "Context: --------- ",
    context,
    " ---------"
  )

  return list?.filter(Boolean)?.join("")
}