import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../ui/tooltip";

type props = {
  url: string
  htmlFor: string
}

function TooltipLable({ url, htmlFor }: props) {
  const pathname = new URL(url).pathname
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <label
            htmlFor={htmlFor}
            className="flex-1 text-sm truncate"
          >
            {pathname}
          </label>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            {pathname}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TooltipLable
