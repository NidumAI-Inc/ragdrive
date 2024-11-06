import { useEffect, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import { nanoid } from "nanoid";

import { downloadGenerateImg } from "../../../actions/img";
import useImgGenStore, { ImgGenMsg } from "../../../store/img-gen";
import { useDownloads } from "../../../components/common/download-manager";
import useContextStore from "../../../store/context";
import { useToast } from "../../../components/ui/use-toast";

import SpeechToText from "../messages/speech-to-text";
import Settings from "../settings";
import ImgModel from "./img-model";
import List from "./list";

import logo from '../../../assets/imgs/logo.png';

function ImgGenerate() {
  const scrollableRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const hfImgGenModel = useContextStore(s => s.hfImgGenModel)
  const hfApiKey = useContextStore(s => s.hfApiKey)

  const project_id = useContextStore(s => s.project_id)

  const { generateImage } = useDownloads()

  const {
    isLoading, messages,
    pushIntoMessages, upadateLoading,
    addBotMessages, deleteMessage, deleteLastProccess,
  } = useImgGenStore()

  const [message, setMessage] = useState('')

  useEffect(() => {
    scrollableRef?.current?.scrollIntoView({ behavior: "instant", block: "end" })
  }, [messages?.[project_id]?.length])

  // @ts-ignore
  const postData = async (inputs: string, dummy: boolean) => {
    try {
      if (inputs) {
        if (!hfApiKey) return toast({ title: "Please provide Hugging Face API key" })
        if (!hfImgGenModel) return toast({ title: "Please choose a Hugging Face image generation model" })

        setMessage("")
        upadateLoading()

        let payload: ImgGenMsg[] = [
          {
            id: nanoid(10),
            role: "user",
            content: inputs,
          },
          {
            id: nanoid(10),
            role: "loading",
            content: "",
          }
        ]
        pushIntoMessages(project_id, payload)

        const fileName = `${nanoid(10)}.png`
        generateImage({
          data: {
            url: `https://api-inference.huggingface.co/models/${hfImgGenModel}`,
            apiKey: hfApiKey,
            fileName,
            inputs,
          },
          onSuccess() {
            addBotMessages(project_id, {
              id: nanoid(10),
              role: "assistant",
              content: fileName,
            })
            toast({ title: `Image - (${inputs}) generated successfully` })
          },
          onError() {
            deleteLastProccess(project_id)
            toast({ title: "Authorization header is correct, but the token seems invalid" })
          }
        })
      }

    } catch (error) {
      console.log(error)
    }
  }

  const sentMessage = () => {
    if (message) {
      postData(message, false)
    }
  }

  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      sentMessage()
    }
  }

  const deleteChat = (msgId: string) => deleteMessage(project_id, msgId)

  function downloadImg(fileName: string) {
    downloadGenerateImg(fileName).then(r => {
      toast({ title: "Image downloaded" })
    })
  }

  return (
    <>
      <div className="scroll-y px-6 py-2 mt-2">
        {
          (!messages?.[project_id] || messages?.[project_id]?.length === 0) &&
          <div className="dfc justify-center items-center h-[calc(100%-3rem)]">
            <img
              className="w-16 opacity-60"
              src={logo}
              alt=""
            />
            <p className="text-white/70">Image Generator</p>
          </div>
        }

        <div className="max-w-4xl w-full mx-auto pt-6 lg:pl-6">
          <List
            list={messages?.[project_id] || []}
            deleteChat={deleteChat}
            downloadImg={downloadImg}
          />

          <div ref={scrollableRef} className="py-2"></div>
        </div>
      </div>

      <div className="df pb-4 px-4 max-w-4xl w-full mx-auto relative">
        <Settings />

        <div className="flex-1 relative">
          <input
            type="text"
            className="pl-4 pr-10 bg-transparent border-2 rounded-full"
            placeholder={
              !hfApiKey
                ? "Please provide a hugging face's api key"
                : "Message"
            }
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={keyPress}
            disabled={isLoading}
          />

          {
            !isLoading && message &&
            <button
              className="p-1.5 animate-in text-lg absolute top-[5px] right-2 hover:bg-border transition-colors rounded-full"
              onClick={sentMessage}
            >
              <LuSend />
            </button>
          }
        </div>

        <SpeechToText
          postData={postData}
          disabled={isLoading}
        />
      </div>

      <ImgModel
        downloadImg={downloadImg}
      />
    </>
  )
}

export default ImgGenerate
