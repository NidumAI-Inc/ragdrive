import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

import { cn } from "../../../lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

type props = {
  name: string
  isActive: boolean
  onDelete: () => void
  onNavigate: () => void
}

function ChatCard({ name, isActive, onNavigate, onDelete }: props) {
  const [open, setOpen] = useState(false)

  return (
    <div
      onClick={onNavigate}
      className={cn("df pl-3 pr-1 py-2 mb-px text-xs cursor-pointer hover:bg-secondary/60 rounded-lg group", {
        "bg-secondary": isActive
      })}
    >
      <p className="flex-1 truncate">{name}</p>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className={`p-1 ${open ? "bg-border" : "opacity-0 group-hover:opacity-100"} hover:bg-border`}>
          <BsThreeDots />
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="start" className="min-w-fit" onClick={e => e.stopPropagation()}>
          <DropdownMenuItem
            className="pr-8 py-1 text-[11px]"
            onClick={onDelete}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ChatCard
