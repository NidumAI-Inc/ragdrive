import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

type props = {
  name: string
  onEdit: () => void
  onDelete: () => void
  onNavigate: () => void
}

function ProjectCard({ name, onEdit, onNavigate, onDelete }: props) {
  const [open, setOpen] = useState(false)

  return (
    <div
      onClick={onNavigate}
      className={`df pl-3 pr-1 py-2 mb-1 text-[13px] truncate cursor-pointer rounded-lg group hover:bg-secondary ${open ? "bg-secondary" : ""}`}
    >
      <p className="flex-1 truncate">{name}</p>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className={`p-1 ${open ? "bg-border" : "opacity-0 group-hover:opacity-100"} hover:bg-border`}>
          <BsThreeDots />
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="start" className="min-w-fit" onClick={e => e.stopPropagation()}>
          <DropdownMenuItem
            className="pr-8 py-1 text-[11px]"
            onClick={onEdit}
          >
            Edit
          </DropdownMenuItem>
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

export default ProjectCard
