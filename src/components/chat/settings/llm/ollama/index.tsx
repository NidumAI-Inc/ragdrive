import { useState } from "react";
import { MdOutlineFileDownload, MdOutlineDeleteOutline } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

// import { useOllamaModels } from "../../../../../hooks/use-ollama";
import { useLLamaDownloadedModels } from "../../../../../hooks/use-llm-models";
import { useDownloads } from "../../../../../components/common/download-manager";
import { useLLMModels } from "../../../../../hooks/use-llm-models";
import useContextStore from "../../../../../store/context";
import { useToast } from "../../../../../components/ui/use-toast";
import useUIStore from "../../../../../store/ui";

import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group";
import { Label } from "../../../../../components/ui/label";
import DeleteModel from "./delete-model";

function Ollama() {
  const { downloads, downloadModel } = useDownloads()
  const ollamaModel = useContextStore(s => s.ollamaModel)

  const updateContext = useContextStore(s => s.updateContext)
  const close = useUIStore(s => s.close)

  const { toast } = useToast()

  const { data: downloaded, isLoading } = useLLamaDownloadedModels()
  const { data: models, isLoading: isLoading2 } = useLLMModels("llm2")

  const queryClient = useQueryClient()

  const [selected, setSelected] = useState(ollamaModel || "")
  const [model, setModel] = useState("")

  const updateModel = (v: string = "") => setModel(v)

  async function download(fullData: any) {
    downloadModel({
      id: fullData.id,
      model: fullData.hf_link,
      lable: fullData.name,
      fileName: fullData.file_name,
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["llama-models-downloaded"] })
      },
      onError() { },
    })
  }

  function onSave() {
    if (downloaded?.some((d: any) => d?.fileName?.includes(selected))) {
      const visionModels = ["llava:7b"]
      const ollamaModeType = visionModels.includes(selected) ? "vision" : ""
      updateContext({ ollamaModel: selected, ollamaModeType })
      close()
    } else {
      toast({
        title: "Model not downloaded yet",
        description: "Please download model to select"
      })
    }
  }

  function closeModel(id: string) {
    if (selected === id) {
      setSelected("")
      updateContext({ ollamaModel: "" })
    }
    setModel("")
  }

  if (isLoading || isLoading2) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <>
      <RadioGroup value={selected} onValueChange={setSelected} className="my-4">
        {
          models?.map((m: any) => (
            <div
              key={m.name}
              className="p-4 mb-2 text-xs border rounded-md"
            >
              <div className="df mb-2">
                <RadioGroupItem value={m.file_name} id={m.file_name} />
                <Label htmlFor={m.file_name} className="mr-auto cursor-pointer">{m.name}</Label>
                {
                  downloaded?.some((d: any) => d?.id === m.id)
                    ? (
                      <button
                        className="-mt-1 -mr-1 p-0.5 text-base hover:bg-input"
                        onClick={() => updateModel(m.file_name)}
                      >
                        <MdOutlineDeleteOutline />
                      </button>
                    ) :
                    downloads[m.id] ?
                      <p className="shrink-0 text-[11px] text-white/70">
                        {downloads[m.id]?.progress}%
                      </p>
                      :
                      <button
                        className="-mt-1 -mr-1 p-0.5 text-base hover:bg-input"
                        onClick={() => download(m)}
                      // disabled={isLoading}
                      >
                        <MdOutlineFileDownload />
                      </button>
                }
              </div>

              <div className="text-[10px] text-white/80">
                <div className="df justify-between my-1.5">
                  <p>Size: {m.size}</p>

                  <p className="w-fit px-2 py-0.5 rounded-full bg-input capitalize">{m.category}</p>
                </div>

                <div className="text-[11px] text-white/60 line-clamp-2">
                  {m.description}
                </div>
              </div>
            </div>
          ))
        }
      </RadioGroup>

      <div className="df justify-between mt-12 mb-4">
        <button
          onClick={close}
          className="w-20 py-1.5 text-[13px] text-white/70 border hover:text-white hover:bg-input"
        >
          Cancel
        </button>

        <button
          className="w-20 py-1.5 text-[13px] bg-black/60 hover:bg-input"
          onClick={onSave}
        >
          Save
        </button>
      </div>

      {
        model &&
        <DeleteModel
          id={model}
          closeModel={closeModel}
          cancelModel={updateModel}
        />
      }
    </>
  )
}

export default Ollama
