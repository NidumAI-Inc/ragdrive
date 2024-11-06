import { useState } from "react";
import { MdDownloadDone, MdOutlineFileDownload } from "react-icons/md";

import { useDownloads } from "../../../../components/common/download-manager";
import useContextStore from "../../../../store/context";
import { useToast } from "../../../../components/ui/use-toast";
import useUIStore from "../../../../store/ui";

import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/label";
// import { deleteWhisperFolder } from "@actions/whisper";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const models = [
//   // { name: "tiny", size: "75 MB", required: "390 MB" },
//   { name: "tiny.en", size: "75 MB", required: "390 MB" },
//   // { name: "base", size: "142 MB", required: "500 MB" },
//   { name: "base.en", size: "142 MB", required: "500 MB" },
//   // { name: "small", size: "466 MB", required: "1.0 GB" },
//   { name: "small.en", size: "466 MB", required: "1.0 GB" },
//   // { name: "medium", size: "1.5 GB", required: "2.6 GB" },
//   { name: "medium.en", size: "1.5 GB", required: "2.6 GB" },
//   { name: "large-v1", size: "2.9 GB", required: "4.7 GB" },
//   { name: "large-v2", size: "2.9 GB", required: "4.7 GB" },
//   { name: "large-v3", size: "2.9 GB", required: "4.7 GB" },
// ]

const models = [
  {
    name: "Xenova/whisper-base.en",
    lable: "Whisper Base",
    size: "142 MB",
    required: "500 MB",
    description: "",
  },
  {
    name: "Xenova/whisper-small.en",
    lable: "Whisper Small",
    size: "466 MB",
    required: "4 GB",
    description: "",
  },
]

function Native() {
  const { downloads, downloadXenovaModels } = useDownloads() // downloadWhisperModel, 
  const downloaded = useContextStore(s => s?.nativeSttModelsDownloaded?.split(","))
  const nativeSttModel = useContextStore(s => s.nativeSttModel)
  const updateContext = useContextStore(s => s.updateContext)
  const close = useUIStore(s => s.close)
  const { toast } = useToast()

  const [selected, setSelected] = useState(nativeSttModel || "")

  // async function download(model: string) {
  //   downloadWhisperModel({
  //     model,
  //     onSuccess() {
  //       updateContext({
  //         nativeSttModelsDownloaded: [...downloaded, model].join(","),
  //       })
  //     },
  //     onError() { },
  //   })
  // }

  function onSave() {
    if (downloaded.includes(selected)) {
      updateContext({
        nativeSttModel: selected,
        nativeSttModelsDownloaded: Array.from(new Set([...downloaded, selected])).filter(Boolean).join(",")
      })
      close()
    } else {
      toast({
        title: "Model not downloaded yet",
        description: "Please download model to select"
      })
    }
  }

  async function reset() {
    try {
      setSelected("")
      updateContext({ nativeSttModelsDownloaded: "", nativeSttModel: "" })
      toast({ title: "Speech to text setup reseted" })

    } catch (error) {
      console.log(error)
    }
  }

  function downloadIt(name: string) {
    downloadXenovaModels({
      name,
      initiater: "xenova",
      onSuccess() {
        updateContext({
          nativeSttModelsDownloaded: [...downloaded, name].join(","),
        })
      },
      onError() {
      }
    })
  }

  return (
    <>
      {/* <label htmlFor="" className="block mb-0.5 mt-6 text-xs text-white/70">Choose a model</label>
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="mb-4">
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent>
          {
            STT_MODELS.map(s => (
              <SelectItem value={s} key={s}>{s}</SelectItem>
            ))
          }
        </SelectContent>
      </Select> */}

      {/* {
        !downloaded.includes(selected) &&
        <>
          <p className="mb-1 text-xs text-white/60">It seems model not downloaded yet. Do you like to download it?</p>

          {
            downloads[selected] ?
              <p className="w-full shrink-0 flex-1 text-[11px] text-white/70">
                {downloads[selected]?.progress}%
              </p>
              :
              <button
                onClick={downloadIt}
                className=" text-xs bg-input hover:bg-input/60"
              >
                Download
              </button>
          }
        </>
      } */}

      <RadioGroup value={selected} onValueChange={setSelected} className="mt-4">
        {
          models.map(m => (
            <div
              key={m.name}
              className="p-4 mb-4 text-xs border rounded-md"
            >
              <div className="df mb-2">
                <RadioGroupItem value={m.name} id={m.name} />
                <Label htmlFor={m.name} className="mr-auto cursor-pointer">{m.lable}</Label>
                {
                  downloaded.includes(m.name)
                    ? <MdDownloadDone title="Model downloaded" />
                    :
                    downloads[m.name] ?
                      <p className="shrink-0 text-[11px] text-white/70">
                        {downloads[m.name]?.progress}%
                      </p>
                      :
                      <button
                        className="-mt-1 -mr-1 p-0.5 text-base hover:bg-input"
                        onClick={() => downloadIt(m.name)}
                      >
                        <MdOutlineFileDownload />
                      </button>
                }
              </div>

              <div className="text-[10px] text-white/70">
                <p>Size: {m.size}</p>
                <p>RAM Required: {m.required}</p>
                <p>Supported Language: English</p>
              </div>
            </div>
          ))
        }
      </RadioGroup>


      {
        nativeSttModel && downloaded.includes(selected) &&
        <div className="df mt-4">
          <p className="text-xs text-white/70">Note: If you face any problem, reset the setup</p>
          <button
            onClick={reset}
            className="px-3 text-xs bg-red-500/50 hover:bg-red-500"
          >
            Reset
          </button>
        </div>
      }

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
    </>
  )
}

export default Native
