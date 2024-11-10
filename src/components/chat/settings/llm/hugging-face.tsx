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

function HuggingFace() {
  const updateContext = useContextStore(s => s.updateContext)
  // const hfImgGenModel = useContextStore(s => s.hfImgGenModel)
  const hfApiKey = useContextStore(s => s.hfApiKey)
  const hfModel = useContextStore(s => s.hfModel)

  // const { isLoading: isLoading2, data: models2 } = useLLMModels("hf-img-gen")
  const { isLoading, data: models } = useLLMModels("hf")

  const [details, setDetails] = useState({
    // hfImgGenModel,
    hfApiKey,
    hfModel,
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

  if (isLoading) { // || isLoading2
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <>
      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Hugging Face Token</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="hf_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
          value={details.hfApiKey}
          onChange={e => onChange({ hfApiKey: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Chat Model</label>

        <Select value={details.hfModel} onValueChange={v => onChange({ hfModel: v })}>
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

      {/* <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Image Generation Model</label>

        <Select value={details.hfImgGenModel} onValueChange={v => onChange({ hfImgGenModel: v })}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Model" />
          </SelectTrigger>

          <SelectContent>
            {
              models2.map(m => (
                <SelectItem
                  value={m.id}
                  key={m.id}
                >
                  {m.name}
                </SelectItem>
              ))
            }

            <SelectItem value="-">
              Not Selected
            </SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      <div className="mb-12 text-xs text-white/60">
        Click here to sign up for a Hugging Face account: <a href="https://huggingface.co/join?ref=nidum.ai" className="text-white/90 hover:underline" target="_blank">https://huggingface.co/join</a>
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default HuggingFace
