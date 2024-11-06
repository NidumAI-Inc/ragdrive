import { useQueryClient } from "@tanstack/react-query";

import { useDownloads } from "../../../../../components/common/download-manager";
import useContextStore from "../../../../../store/context";

function Ollama() {
  const updateContext = useContextStore(s => s.updateContext)
  const ollamaEmbeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  const ollamEmbeddingUrl = useContextStore(s => s.ollamEmbeddingUrl)

  const { downloads, downloadModel } = useDownloads()
  const queryClient = useQueryClient()

  return (
    <>
      {
        downloads?.["mxbai-embed-large:latest"] &&
        <div className="mt-4 text-xs text-white/70">
          RAG setup progress: {downloads?.["mxbai-embed-large:latest"]?.progress}%
        </div>
      }

      {
        !ollamaEmbeddingModel && !downloads?.["mxbai-embed-large:latest"] &&
        <div className="mt-4 text-xs">
          <p className="mb-0.5 text-white/60">
            The RAG processing model is not setuped yet. Do you want to initiate the setup?
          </p>
          <button
            className="px-3 py-1.5 bg-input"
            onClick={() => downloadModel({
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
            })}
          >
            Download and setup
          </button>
        </div>
      }

      {
        ollamEmbeddingUrl && ollamaEmbeddingModel && !downloads?.["mxbai-embed-large:latest"] &&
        <div className="mt-4 text-[10px] text-white/60">
          You are all set to use RAG. You can enable RAG under project section.
        </div>
      }
    </>
  )
}

export default Ollama
