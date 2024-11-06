import useContextStore from "../../../../store/context";

import SelectModel from "./select-model";
import Ollama from "./ollama";

function Embedder() {
  const embedding_type = useContextStore(s => s.embedding_type)

  return (
    <>
      <SelectModel />

      {
        embedding_type === "Ollama" &&
        <Ollama />
      }

      {/* {
        embedding_type === "Nidum" &&
        <div className="mt-6 text-xs text-white/60">
          There is no configuration needed for this provider.
        </div>
      } */}
    </>
  )
}

export default Embedder
