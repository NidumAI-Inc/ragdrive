// import { useOllamaModels } from "../../hooks/use-ollama"
import { cn } from "../../lib/utils"

type props = {
  ollamaUrl: string
  className?: string
}

function OllmaStatusCheck({ ollamaUrl, className = "" }: props) {
  // const { isLoading, data, isError } = useOllamaModels(ollamaUrl)

  return (
    <span className={cn("block size-1.5 rounded-full bg-green-400", className, {
      // "bg-white/50 animate-pulse": isLoading,
      // "bg-green-400": !!data && !isError,
      // "bg-red-400": isError,
    })}></span>
  )
}

export default OllmaStatusCheck
