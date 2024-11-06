import { useState } from "react";
import { LuChevronRight } from "react-icons/lu";

import useIsFullScreenCheck from "../../../hooks/use-is-full-screen-check";
import useContextStore from "../../../store/context";
import usePlatform from "../../../hooks/use-platform";
import llmModels from "../../../utils/llm-models";
import { cn } from "../../../lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import OllmaStatusCheck from "../../../components/common/ollma-status-check";

function ModelSelect() {
  const isFullScreen = useIsFullScreenCheck()
  const platform = usePlatform()

  const updateContext = useContextStore(s => s.updateContext)
  const model_type = useContextStore(s => s.model_type)
  const ollamaUrl = useContextStore(s => s.ollamaUrl)
  const chat_id = useContextStore(s => s.chat_id)

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={`non-draggable df gap-px pl-28 [.open_&]:pl-0 text-sm transition-all ${isFullScreen || platform === "windows" ? "-translate-x-20 [.open_&]:translate-x-0" : ""}`}>
        AI Server: {model_type === "Ollama" ? "Local" : model_type} <LuChevronRight className="opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="p-1 space-y-1 data-[state=open]:duration-300 data-[state=closed]:duration-300">
        {
          llmModels.map(l => (
            <div
              key={l.id}
              className={cn("df p-2 cursor-pointer rounded hover:bg-input/40", {
                "bg-input/50": l.title === model_type
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
                  className="w-7"
                  src={l.logo}
                  alt={l.title}
                />
                {
                  model_type === "Ollama" && l.title === "Ollama" &&
                  <OllmaStatusCheck ollamaUrl={ollamaUrl} className="absolute top-0 -right-0.5" />
                }
              </div>

              <div className="">
                <p className="text-sm group-hover:underline">{l.title === "Ollama" ? "Local" : l.title}</p>
                <p className="text-[10px] text-white/70">{l.para}</p>
              </div>
            </div>
          ))
        }
      </PopoverContent>
    </Popover>
  )
}

export default ModelSelect
