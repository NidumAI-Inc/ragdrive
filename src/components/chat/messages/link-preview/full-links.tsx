import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../ui/sheet";

import LinkCard from "./link-card";

type props = {
  urls: string[]
}

function FullLinks({ urls }: props) {
  const [open, setOpen] = useState(false)

  const updateOpen = () => setOpen(p => !p)

  return (
    <Sheet open={open} onOpenChange={updateOpen}>
      <SheetTrigger className=" mt-auto px-2.5 py-1.5 text-[11px] rounded-md bg-zinc-800">
        View all sourses
        {/* <div className="df gap-1 flex-wrap px-2.5 py-1.5 text-[11px] rounded-md bg-zinc-800 cursor-pointer">
          {data?.filter((d, i) => i > 4 && !!d?.favicon)?.filter((d, i) => i < 5)?.map((d, i) => (
            <img
              className="size-4 rounded-full"
              src={d?.favicon}
              key={i}
            />
          ))}

          <span className="w-full flex-1 text-[10px] opacity-60">View all sourses</span>
        </div> */}
      </SheetTrigger>

      <SheetContent className="dfc p-4">
        <SheetHeader>
          <SheetTitle>{urls?.length} Sources</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="scroll-y pr-4 -mr-4 space-y-4">
          {
            open && urls?.map(d => (
              <LinkCard
                key={d}
                url={d}
                isBig
              />
            ))
          }
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FullLinks
