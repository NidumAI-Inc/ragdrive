import { useState } from "react";

import { sortUrlsByPathname } from "../../../../../../utils/url-helper";
import useContextStore from '../../../../../../store/context';
import { useAddCrawl } from "../../../../../../hooks/use-crawler";

import TooltipLable from "../tooltip-lable";
import GetLinks from "./get-links";

function Add() {
  const projectId = useContextStore(s => s.project_id)

  const [includedLinks, setIncludedLinks] = useState<string[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [step, setStep] = useState(1)

  const { mutate, isPending } = useAddCrawl()

  function updateLinks(payload: string[]) {
    setLinks(p => sortUrlsByPathname([...new Set([...p, ...payload])]))
    setIncludedLinks(p => [...new Set([...p, ...payload])])
    setStep(2)
  }

  function onSubmit() {
    mutate(
      {
        urls: includedLinks,
        folderName: projectId
      },
      {
        onSettled() {
          setIncludedLinks([])
          setLinks([])
          setStep(1)
        }
      }
    )
  }

  if (step === 1) {
    return (
      <GetLinks updateLinks={updateLinks} />
    )
  }

  return (
    <div className="mini-scroll-bar md:pr-8 md:-mr-8 md:max-h-96 md:overflow-y-auto">
      {
        includedLinks[0] &&
        <h5 className="mb-1 text-sm">{new URL(includedLinks?.[0])?.origin}</h5>
      }
      {
        links.map(l => (
          <div key={l} className="df mb-1">
            <input
              type="checkbox"
              className="w-fit"
              value={l}
              id={l}
              checked={includedLinks.includes(l)}
              onChange={() => setIncludedLinks(prev => includedLinks.includes(l) ? prev.filter(p => p !== l) : [...prev, l])}
            />
            <TooltipLable
              htmlFor={l}
              url={l}
            />
          </div>
        ))
      }

      <button
        disabled={isPending}
        onClick={onSubmit}
        className="df px-12 py-1.5 mt-4 mx-auto text-xs bg-input hover:bg-input/80"
      >
        Crawle Pages
      </button>
    </div>
  )
}

export default Add
