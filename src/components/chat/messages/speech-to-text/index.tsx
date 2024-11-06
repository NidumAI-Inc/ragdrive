
import useSttValidCheck from "../../../../hooks/use-stt-valid-check";
import useContextStore from "../../../../store/context";

import NativeProvider from "./native-provider";
import GroqProvider from "./grog-provider";

type props = {
  disabled: boolean
  postData: (s: string, v: boolean) => void
}

function SpeechToText({ disabled, postData }: props) {
  const stt_type = useContextStore(s => s.stt_type)
  const isSupported = useSttValidCheck()

  if (!isSupported) return null

  return stt_type === "Groq" ? (
    <GroqProvider
      postData={postData}
      disabled={disabled}
    />
  ) : (
    <NativeProvider
      postData={postData}
      disabled={disabled}
    />
  )
}

export default SpeechToText
