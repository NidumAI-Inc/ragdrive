import { useQuery } from "@tanstack/react-query";

import { getOllamaTags } from "../actions/ollama";

export function useOllamaModels(ollamaUrl: string = "http://localhost:11490") {
  return useQuery({
    queryKey: ["ollama-tags", ollamaUrl],
    queryFn: () => getOllamaTags(ollamaUrl),
    enabled: !!ollamaUrl,
  })
}
