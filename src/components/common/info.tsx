import { IoMdInformationCircleOutline } from "react-icons/io";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

type props = {
  details: string
}

function Info({ details }: props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="p-0">
          <IoMdInformationCircleOutline className="text-xs opacity-70" />
        </TooltipTrigger>

        <TooltipContent side="top" className="max-w-xs">
          {details}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Info
