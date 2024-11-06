import { useState } from "react";

import useContextStore from "../../../../store/context";
import useVoices from "./use-voices";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import Footer from "../common/footer";

function Native() {
  const voices = useVoices()

  const updateContext = useContextStore(s => s.updateContext)
  const voice = useContextStore(s => s.voice)

  const [details, setDetails] = useState({
    voice,
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
      <div className="my-4">
        <label className="mb-0.5 text-xs opacity-70">Voice</label>

        <Select value={details.voice} onValueChange={v => onChange({ voice: v })}>
          <SelectTrigger className="w-full h-8 text-sm">
            <SelectValue placeholder="Voice" />
          </SelectTrigger>

          <SelectContent className="max-h-64">
            {
              voices.map(v => (
                <SelectItem
                  key={v.name}
                  value={v.name}
                >
                  {v.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default Native
