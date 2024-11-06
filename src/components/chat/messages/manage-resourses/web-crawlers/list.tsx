import { useId, useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { useCrawler, useDeleteCrawledLinks } from "../../../../../hooks/use-crawler";
import useContextStore from "../../../../../store/context";
import TooltipLable from "./tooltip-lable";

type props = {
  url: string
  checked: string[]
  onCheck: (v: string) => void
}

function Card({ url, checked, onCheck }: props) {
  const id = useId()
  return (
    <div className="df mb-0.5 pl-4 opacity-90">
      <input
        type="checkbox"
        id={id}
        value={url}
        checked={checked.includes(url)}
        onChange={() => onCheck(url)}
        className="w-fit"
      />
      <TooltipLable
        htmlFor={id}
        url={url}
      />
    </div>
  )
}

function List() {
  const projectId = useContextStore(s => s.project_id)

  const { data, isLoading } = useCrawler()
  const { mutate: mutateDelete, isPending } = useDeleteCrawledLinks()

  const [checked, setChecked] = useState<string[]>([])

  function onCheck(val: string) {
    setChecked(prev => prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val])
  }

  function onDelete(urls: string[]) {
    mutateDelete(
      {
        urls,
        folderName: projectId,
      },
      {
        onSuccess() {
          setChecked([])
        }
      }
    )
  }

  return (
    <div className='mini-scroll-bar px-4 md:max-h-96 max-md:pt-6 md:overflow-y-auto border-t md:border-t-0 md:border-l'>
      {
        !isLoading && data &&
        Object?.entries(data)?.map(([key, urls]: any) => (
          <div
            key={key}
            className="mb-4 text-sm"
          >
            <div className="df mb-1">
              <h6 className="font-medium">{key}</h6>

              <button
                className="p-0.5 bg-gray-700 hover:bg-red-400"
                disabled={isPending}
                onClick={() => onDelete(urls)}
              >
                <MdOutlineDeleteOutline />
              </button>
            </div>
            {
              urls?.map((url: any) => (
                <Card
                  key={url}
                  url={url}
                  checked={checked}
                  onCheck={onCheck}
                />
              ))
            }
          </div>
        ))
      }

      {
        checked.length > 0 &&
        <button
          className="px-2 py-px text-[11px] text-foreground bg-red-600 hover:bg-red-700 transition-colors rounded-[2px]"
          onClick={() => onDelete(checked)}
          disabled={isPending}
        >
          Delete selected
        </button>
      }
    </div>
  )
}

export default List
