import useContextStore from "../../../../store/context";

import SelectModel from "./select-model";
import Native from "./native";

function Voice() {
  const tts_type = useContextStore(s => s.tts_type)

  return (
    <>
      {/* <div className="mb-0.5 text-xs text-gray-500">Text to Speech Provider</div> */}
      <SelectModel />

      {
        tts_type === "System native" &&
        <Native />
      }
    </>
  )
}

export default Voice
