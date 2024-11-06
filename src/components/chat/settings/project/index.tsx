import { useState } from "react";

import useContextStore from "../../../../store/context";
import { useCrawler } from "../../../../hooks/use-crawler";
import useConvoStore from "../../../../store/conversations";
// import useUIStore from "@store/ui";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Switch } from "../../../../components/ui/switch";

import Info from "../../../../components/common/info";
import Footer from "../common/footer";

function Chat() {
  const editProject = useConvoStore(s => s.editProject)
  // const updateTab = useUIStore(s => s.update)

  // const ollamaEmbeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  const project_id = useContextStore(s => s.project_id)
  const { data: crawlerData } = useCrawler()

  const projectMap = useConvoStore(s => s.projects)
  const hasFiles = useConvoStore(s => s.files[project_id]?.length)
  const projects = useConvoStore(s => Object.values(s.projects))

  const [selected, setSelected] = useState(project_id || "")
  const [details, setDetails] = useState(projectMap[project_id] || {
    temperature: "",
    max_tokens: "",
    frequency_penalty: "",
    top_p: "",
    // tokenLimit: "",
    web_enabled: false,
    rag_enabled: false,
  })

  const hasWebCrawle = crawlerData && Object.keys(crawlerData)?.length > 0

  const onChange = (key: string, val: any) => {
    setDetails(pr => ({
      ...pr,
      [key]: val
    }))
  }

  function onSave() {
    editProject(selected, details as any)
  }

  function onSelectProject(val: string) {
    setSelected(val)
    setDetails(projectMap[val] as any)
  }

  function onChangeRag(key: "rag_enabled" | "web_enabled", val: boolean) {
    let alterKey = key === "rag_enabled" ? "web_enabled" : "rag_enabled"
    setDetails(pr => ({
      ...pr,
      [key]: val,
      [alterKey]: false,
    }))
  }

  return (
    <>
      <div className="mb-4">
        <label className="df mb-0.5 text-xs opacity-70">Project Name</label>

        <Select value={selected} onValueChange={onSelectProject}>
          <SelectTrigger className="w-full h-8 text-sm focus:ring-0">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>

          <SelectContent>
            {
              projects.map(pro => (
                <SelectItem
                  value={pro.id}
                  key={pro.id}
                >
                  {pro.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Temperature</span>
          <Info details="Controls the randomness of the model's responses. Lower values (e.g., 0.1) make the output more deterministic and focused, while higher values (e.g., 1.0) make it more random and creative." />
        </p>
        <input
          min={0}
          max={1}
          step={0.1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.temperature || ""}
          onChange={e => onChange("temperature", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>

      <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Max Tokens</span>
          <Info details="The maximum number of tokens the model can generate in a single response. Limiting this helps manage response length and resource usage." />
        </p>
        <input
          min={1}
          step={1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.max_tokens || ""}
          onChange={e => onChange("max_tokens", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>

      <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Repeat Penalty</span>
          <Info details="A parameter that discourages the model from repeating the same text. A higher penalty value reduces repetition, making responses more varied." />
        </p>
        <input
          min={-2}
          max={2}
          step={.1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.frequency_penalty || details?.frequency_penalty === 0 ? details?.frequency_penalty : ""}
          onChange={e => onChange("frequency_penalty", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>

      <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Top P Sampling</span>
          <Info details="Adjusts the probability threshold for token sampling. Setting this to 1 means the model considers all possible tokens, while lower values limit the selection to more likely tokens, improving coherence." />
        </p>

        <input
          min={0}
          max={1}
          step={.1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.top_p || ""}
          onChange={e => onChange("top_p", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>

      {/* <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Token Limit</span>
          <Info details="A Token Limit in a Large Language Model (LLM) refers to the maximum number of tokens (words or characters) the model can process in a single interaction. Staying within this limit ensures optimal performance and accurate responses." />
        </p>
        <input
          min={1}
          step={1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.tokenLimit || ""}
          onChange={e => onChange("tokenLimit", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div> */}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 border rounded-md">
          <label htmlFor="" className="mb-0.5 text-xs opacity-80">Web Search</label>
          <p className="text-[10px] text-white/60">Enable and retrieve an answers from the <br /> web.</p>
          <Switch
            checked={details.web_enabled}
            onCheckedChange={val => onChangeRag("web_enabled", val)}
            title="Enable web search"
            className="ml-auto"
            disabled={!selected}
          />
        </div>

        <div className="p-3 border rounded-md">
          <label htmlFor="" className="mb-0.5 text-xs opacity-80">RAG Search</label>
          <p className="text-[10px] text-white/60">Enable and retrieve answers from the uploaded documents.</p>
          <Switch
            checked={details.rag_enabled}
            onCheckedChange={val => onChangeRag("rag_enabled", val)}
            title={!hasFiles ? "Upload files or webcrawle sites to enable RAG search" : "Enable RAG search"}
            className="ml-auto"
            disabled={!selected || !(hasFiles || hasWebCrawle)}
          />
        </div>
      </div>

      {
        !hasFiles &&
        <div className="text-[10px] text-white/60">
          Note: For RAG, no file is currently uploaded. Please upload a file and enable RAG to proceed.
        </div>
      }

      <Footer onSave={onSave} />
    </>
  )
}

export default Chat
