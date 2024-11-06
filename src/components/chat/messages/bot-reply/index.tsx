import { PiSpeakerSimpleHighDuotone, PiSpeakerSimpleSlash } from "react-icons/pi";
import { MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import { TbLoader2 } from "react-icons/tb";

import { useAudioStore, useAudio } from "../use-speech";
import useClipboardCopy from "../../../../hooks/use-clipboard-copy";

import logo from '../../../../assets/imgs/logo.png';

import MarkdownParser from "./markdown-parse";

type props = {
  id: string
  isTemp: boolean
  response: string
  webSearched?: string[]
  deleteChat?: () => void
}

function BotReply({ id, response, isTemp = false, deleteChat = () => { } }: props) {
  const isSpeaking = useAudioStore(s => s.isSpeaking)
  const botResId = useAudioStore(s => s.botResId)
  const loading = useAudioStore(s => s.loading)

  const { copied, onCopyClk } = useClipboardCopy()
  const { onClkSpeakBtn } = useAudio()

  const onCopy = () => onCopyClk(response)

  return (
    <div className="mb-6 group">
      <div className="w-fit max-w-[88%] py-2 ml-9 relative">
        <div className="dc size-7 absolute top-1 -left-9 border rounded-full">
          <img
            alt=""
            src={logo}
            className="w-4"
          />
        </div>

        <MarkdownParser response={response} />
      </div>

      {
        !isTemp &&
        <div className='df gap-4 ml-8 opacity-0 group-hover:opacity-100 text-white/60'>
          <button
            className="p-0 hover:text-white"
            onClick={() => onClkSpeakBtn(id, response)}
            disabled={!!botResId && botResId !== id}
          >
            {
              botResId === id ? <>
                {
                  loading ?
                    <TbLoader2 className="animate-spin" />
                    : !isSpeaking
                      ? <PiSpeakerSimpleHighDuotone />
                      : <PiSpeakerSimpleSlash />
                }
              </>
                : <PiSpeakerSimpleHighDuotone />
            }
          </button>

          <button
            onClick={onCopy}
            disabled={copied}
            className='df gap-1 text-[10px] p-0 hover:text-white'
          >
            <MdOutlineContentCopy />

            {copied ? "Copied" : "Copy"}
          </button>

          <button
            className="p-0 hover:text-white"
            onClick={deleteChat}
          >
            <MdDeleteOutline />
          </button>
        </div>
      }
    </div>
  )
}

export default BotReply
