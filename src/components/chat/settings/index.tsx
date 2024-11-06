import { HiOutlineInformationCircle } from "react-icons/hi2";
import { MdOutlineRecordVoiceOver } from "react-icons/md";
import { GoProjectRoadmap } from "react-icons/go";
import { RiVoiceprintFill } from "react-icons/ri";
import { FaLinode } from "react-icons/fa";

import useSttValidCheck from "../../../hooks/use-stt-valid-check";
import useUIStore from "../../../store/ui";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

import SettingIcon from '../../../assets/svg/settings.svg?react';

import Transcribe from "./transcribe";
import Project from "./project";
import Voice from "./voice";
import About from "./about";
import LLM from "./llm";

const list = [
  {
    id: "1",
    title: "Project",
    logo: <GoProjectRoadmap className="text-base" />,
    child: <Project />,
  },
  {
    id: "2",
    title: "AI Model",
    logo: <FaLinode className="text-base" />,
    child: <LLM />,
  },
  {
    id: "3",
    title: "Speech to Text",
    logo: <MdOutlineRecordVoiceOver className="text-base" />,
    child: <Transcribe />,
  },
  {
    id: "4",
    title: "Text to Speech",
    logo: <RiVoiceprintFill className="text-base" />,
    child: <Voice />,
  },
  {
    id: "5",
    title: "About",
    logo: <HiOutlineInformationCircle className="text-base" />,
    child: <About />,
  },
]

function Settings() {
  const update = useUIStore(s => s.update)
  const selected = useUIStore(s => s.data || "Project")
  const open = useUIStore(s => s.open)

  const isSupported = useSttValidCheck()

  function onOpenChange(val: boolean) {
    update({
      open: val ? "settings" : "",
      data: "Project"
    })
  }

  return (
    <Dialog open={open === "settings"} onOpenChange={onOpenChange}>
      <DialogTrigger className="dc w-8 h-8 p-0 shrink-0 text-xl rounded-full cursor-pointer hover:bg-input">
        <SettingIcon />
      </DialogTrigger>

      <DialogContent className=" max-w-xl">
        <DialogHeader className="pb-2 md:pb-4 mb-2 border-b">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="mini-scroll-bar flex items-center gap-2 py-2 overflow-x-auto">
          {
            list
              .filter(l => isSupported ? true : l.title !== "Transcription")
              .map(l => (
                <button
                  key={l.id}
                  onClick={() => update({ data: l.title })}
                  className={`df text-nowrap text-xs text-left hover:bg-input ${selected === l.title ? "bg-input text-white [&_svg]:stroke-white" : " text-white/60 [&_svg]:stroke-white/60"}`}
                >
                  {l.logo}
                  {l.title}
                </button>
              ))
          }
        </div>

        <div className="h-96 -mr-6 pr-6 overflow-y-auto">
          {list?.find(l => l.title === selected)?.child}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Settings
