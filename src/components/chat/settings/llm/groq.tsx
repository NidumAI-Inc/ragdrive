import { useState } from "react";

import { useLLMModels } from "../../../../hooks/use-llm-models";
import useContextStore from "../../../../store/context";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import Footer from "../common/footer";

function Groq() {
  const updateContext = useContextStore(s => s.updateContext)
  const groqApiKey = useContextStore(s => s.groqApiKey)
  const groqModel = useContextStore(s => s.groqModel)

  const { isLoading, data: models } = useLLMModels("groq")

  const [details, setDetails] = useState({
    groqApiKey,
    groqModel,
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

  if (isLoading) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <>
      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Groq API Key</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="gsk_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
          value={details.groqApiKey}
          onChange={e => onChange({ groqApiKey: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Model</label>

        <Select value={details.groqModel} onValueChange={v => onChange({ groqModel: v })}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Model" />
          </SelectTrigger>

          <SelectContent>
            {
              models.map((m: any) => (
                <SelectItem
                  value={m.id}
                  key={m.id}
                >
                  {m.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      <div className="mb-12 text-xs text-white/60">
        Click here to sign up for a Groq account: <a href="https://console.groq.com/login?ref=nidum.ai" className=" text-white/90 hover:underline" target="_blank">https://console.groq.com/login</a>
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default Groq
