import { TbArrowBackUp } from "react-icons/tb";

import useContextStore from "../../../store/context";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
} from "../../../components/ui/tooltip";

function GoToProject() {
  const updateContext = useContextStore(s => s.updateContext)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="p-0.5 absolute top-1.5 right-3 text-white/60 transition-colors hover:bg-secondary"
          onClick={() => updateContext({ project_id: "" })}
        >
          <TbArrowBackUp className="text-base" />
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent side="right" className="text-[10px]">
            Go to projects
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}

export default GoToProject
