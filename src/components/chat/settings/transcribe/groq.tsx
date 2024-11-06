import { useState } from "react";
import useContextStore from "../../../../store/context";
import Footer from "../common/footer";

function Groq() {
  const updateContext = useContextStore(s => s.updateContext)
  const sttGroqApiKey = useContextStore(s => s.sttGroqApiKey)

  const [details, setDetails] = useState({
    sttGroqApiKey,
  })

  function onChange(payload: Record<string, any>) {
    setDetails(pr => ({
      ...pr,
      ...payload,
    }))
  }

  function onSave() {
    updateContext(details)
  }

  return (
    <>
      <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs">Groq api key</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="gsk_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
          value={details.sttGroqApiKey}
          onChange={e => onChange({ sttGroqApiKey: e.target.value })}
        />
      </div>

      <div className="mt-6 text-xs text-white/60">
        Click here to sign up for a Groq developer account: <a href="https://console.groq.com/login" className=" text-white/90 hover:underline" target="_blank">https://console.groq.com/login</a>
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default Groq
