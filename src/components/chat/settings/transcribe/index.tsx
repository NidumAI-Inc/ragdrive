import useContextStore from "../../../../store/context";

import SelectModel from "./select-model";
import Native from "./native";
import Groq from "./groq";

function Transcribe() {
  const sttType = useContextStore(s => s.stt_type)

  return (
    <>
      {/* <div className="mb-0.5 text-xs text-gray-500">Speech to Text Provider</div> */}
      <SelectModel />

      {
        sttType === "Groq" && <Groq />
      }

      {
        sttType === "System native" && <Native />
      }
    </>
  )
}

export default Transcribe
