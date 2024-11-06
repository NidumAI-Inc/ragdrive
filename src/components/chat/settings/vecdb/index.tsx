import useContextStore from "../../../../store/context";

import SelectModel from "./select-model";
import Qdrant from "./qdrant";

function VecDB() {
  const vb_type = useContextStore(s => s.vb_type)

  return (
    <>
      <SelectModel />

      {
        vb_type === "Qdrant" &&
        <Qdrant />
      }

      {/* {
        vb_type === "Nidum" &&
        <div className="mt-6 text-xs text-white/60">
          There is no configuration needed for this provider.
        </div>
      } */}
    </>
  )
}

export default VecDB
