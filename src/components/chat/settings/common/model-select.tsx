import { useOllamaModels } from "../../../../hooks/use-ollama";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

type props = {
  val: string
  ollamaUrl: string
  filterFn: (m: any) => boolean;
  onChange: (v: string) => void
}

function ModelSelect({ ollamaUrl, val, filterFn, onChange }: props) {
  const { data, isLoading } = useOllamaModels(ollamaUrl)

  if (isLoading) {
    return <div className="text-xs text-white/60">Loading...</div>
  }

  if (!isLoading && data?.length === 0) {
    return <div className="text-xs text-white/60">No model available</div>
  }

  return (
    <Select value={val} onValueChange={onChange}>
      <SelectTrigger className="h-9 px-2 py-1.5 text-sm bg-transparent border focus:ring-0">
        <SelectValue placeholder="Server" />
      </SelectTrigger>

      <SelectContent className="[&_svg]:hidden min-w-[100px]">
        {
          !isLoading &&
          data
            ?.filter(filterFn)
            ?.map((m: any) => (
              <SelectItem
                className="h-6 px-2 text-xs"
                value={m.model}
                key={m.model}
              >
                {m.name}
              </SelectItem>
            ))
        }
      </SelectContent>
    </Select>
  )
}

export default ModelSelect
