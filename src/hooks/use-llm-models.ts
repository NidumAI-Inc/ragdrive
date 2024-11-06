import { useQuery } from "@tanstack/react-query";

import { getLLMModels, getLLamaDownloadedModels } from "../actions/llms";

type llmT = "llm" | "llm2" | "groq" | "hf" | "hf-img-gen" | "sambanova-systems" | "anthropic" | "openai"

export function useLLMModels(llm: llmT) {
  return useQuery({
    queryKey: [`${llm}-models`],
    queryFn: () => getLLMModels(llm)
  })
}

export function useLLamaDownloadedModels() {
  return useQuery({
    queryKey: ["llama-models-downloaded"],
    queryFn: getLLamaDownloadedModels,
  })
}
