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

function Anthropic() {
  const updateContext = useContextStore(s => s.updateContext)
  const anthropicApiKey = useContextStore(s => s.anthropicApiKey)
  const anthropicModel = useContextStore(s => s.anthropicModel)

  const { isLoading, data: models } = useLLMModels("anthropic")

  const [details, setDetails] = useState({
    anthropicApiKey,
    anthropicModel,
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
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Anthropic API Key</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="432v-vjhfuyfjhb-2387r-2387rh27n3r"
          value={details.anthropicApiKey}
          onChange={e => onChange({ anthropicApiKey: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Model</label>

        <Select value={details.anthropicModel} onValueChange={v => onChange({ anthropicModel: v })}>
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
        Click here to sign up for a Anthropic account: <a href="https://console.anthropic.com/login?ref=nidum.ai" className=" text-white/90 hover:underline" target="_blank">https://console.anthropic.com/login</a>
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default Anthropic
