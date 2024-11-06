import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useDownloads } from "../components/common/download-manager";
import useContextStore from "../store/context";
import { initSetup } from "../actions/ollama";

function useInitSetup() {
  const ollamaEmbeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  const ollamEmbeddingUrl = useContextStore(s => s.ollamEmbeddingUrl)
  const updateContext = useContextStore(s => s.updateContext)

  const { downloadModel } = useDownloads()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ["init-setup"],
    queryFn: initSetup,
  })

  useEffect(() => {
    if (data && !ollamaEmbeddingModel) {
      setTimeout(() => {
        downloadModel({
          id: "",
          model: "",
          lable: "",
          fileName: "",
          // name: "mxbai-embed-large:latest",
          // ollamaUrl: ollamEmbeddingUrl,
          // initiater: "embedder",
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["ollama-tags"] })
            updateContext({ ollamaEmbeddingModel: "mxbai-embed-large:latest" })
          },
          onError() { },
        })
      }, 2000)
    }
  }, [data, ollamaEmbeddingModel, ollamEmbeddingUrl])
}

export default useInitSetup
