import { useState } from "react";
import { BiExpandAlt } from "react-icons/bi";

import useContextStore from "../../../../store/context";
import { cn } from "../../../../lib/utils";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import OllmaStatusCheck from "../../../../components/common/ollma-status-check";
import llmModels from "../../../../utils/llm-models";

function SelectModel() {
  const updateContext = useContextStore(s => s.updateContext)
  const model_type = useContextStore(s => s.model_type)
  const ollamaUrl = useContextStore(s => s.ollamaUrl)
  const chat_id = useContextStore(s => s.chat_id)

  const [open, setOpen] = useState(false)

  const found: any = llmModels?.find(l => l.title === model_type) || null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-sm border" asChild>
        <div className="df gap-4 px-4 py-2.5 rounded-md cursor-pointer hover:bg-input/30">
          <div className="dc size-8 shrink-0 relative">
            <img
              className="w-8"
              src={found?.logo}
              alt=""
            />
            {
              found.title === "Ollama" &&
              <OllmaStatusCheck ollamaUrl={ollamaUrl} className="absolute top-0 -right-2" />
            }
          </div>

          <div className="text-left">
            <p className="text-sm group-hover:underline">AI Server: {found.title === "Ollama" ? "Local" : found.title}</p>
            <p className="text-xs text-white/70">{found?.para}</p>
          </div>

          <BiExpandAlt className="ml-auto rotate-[-45deg] shrink-0" />
        </div>
      </DialogTrigger>

      <DialogContent>
        <div className="mt-3">
          {
            llmModels.map(l => (
              <div
                key={l.id}
                className={cn("df gap-4 mb-4 pl-8 -ml-6 last:mb-0 group cursor-pointer border-l-2 border-transparent hover:border-l-white", {
                  "border-white": l.title === model_type
                })}
                onClick={() => {
                  let payload: any = { model_type: l.title }
                  if (chat_id.endsWith("-imgGen")) {
                    payload.chat_id = ""
                  }
                  updateContext(payload)
                  setOpen(false)
                }}
              >
                <div className="dc size-8 relative">
                  <img
                    className="w-8"
                    src={l.logo}
                    alt={l.title}
                  />
                  {
                    l.title === "Ollama" &&
                    <OllmaStatusCheck ollamaUrl={ollamaUrl} className="absolute top-0 -right-2" />
                  }
                </div>

                <div className="">
                  <p className="text-sm group-hover:underline">{l.title === "Ollama" ? "Local" : l.title}</p>
                  <p className="text-xs text-white/70">{l.para}</p>
                </div>
              </div>
            ))
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SelectModel
