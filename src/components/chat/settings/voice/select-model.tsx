import { useState } from "react";
import { BiExpandAlt } from "react-icons/bi";

import useContextStore from "../../../../store/context";
import { cn } from "../../../../lib/utils";

import logo from '../../../../assets/imgs/logo.png';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../../components/ui/dialog";

type listT = {
  id: string
  title: "System native"
  logo: string
  para: string
}

const list: listT[] = [
  {
    id: "1",
    logo: logo,
    title: "System native",
    para: "Uses your browser's built in TTS service if supported."
  },
]

function SelectModel() {
  const updateContext = useContextStore(s => s.updateContext)
  const tts_type = useContextStore(s => s.tts_type)

  const [open, setOpen] = useState(false)

  const found = list?.find(l => l.title === tts_type) || null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-sm border" asChild>
        <div className="df gap-4 px-4 py-2.5 rounded-md cursor-pointer hover:bg-input/30">
          <div className="dc size-8 shrink-0">
            <img className="w-8" src={found?.logo} alt="" />
          </div>

          <div className="text-left">
            <p className="text-sm group-hover:underline">{found?.title}</p>
            <p className="text-xs text-white/70">{found?.para}</p>
          </div>

          <BiExpandAlt className="ml-auto rotate-[-45deg] shrink-0" />
        </div>
      </DialogTrigger>

      <DialogContent>
        <div className="mt-3">
          {
            list.map(l => (
              <div
                key={l.id}
                className={cn("df gap-4 mb-4 pl-8 -ml-6 last:mb-0 group cursor-pointer border-l-2 border-transparent hover:border-l-white", {
                  "border-white": l.title === tts_type
                })}
                onClick={() => {
                  updateContext({ tts_type: l.title })
                  setOpen(false)
                }}
              >
                <div className="dc size-8">
                  <img
                    className="w-8"
                    src={l.logo}
                    alt={l.title}
                  />
                </div>

                <div className="">
                  <p className="text-sm group-hover:underline">{l.title}</p>
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
