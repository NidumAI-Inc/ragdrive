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

function OpenAI() {
  const updateContext = useContextStore(s => s.updateContext)
  const openaiApiKey = useContextStore(s => s.openaiApiKey)
  const openaiModel = useContextStore(s => s.openaiModel)

  const { isLoading, data: models } = useLLMModels("openai")

  const [details, setDetails] = useState({
    openaiApiKey,
    openaiModel,
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
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">OpenAI API Key</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="432v-vjhfuyfjhb-2387r-2387rh27n3r"
          value={details.openaiApiKey}
          onChange={e => onChange({ openaiApiKey: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Model</label>

        <Select value={details.openaiModel} onValueChange={v => onChange({ openaiModel: v })}>
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
        Click here to sign up for a OpenAI account: <a href="https://platform.openai.com?ref=nidum.ai" className=" text-white/90 hover:underline" target="_blank">https://platform.openai.com</a>
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default OpenAI
