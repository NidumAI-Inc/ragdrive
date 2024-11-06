import { LuCheck } from "react-icons/lu";
import { BiCopy } from "react-icons/bi";

import useClipboardCopy from "../../../../hooks/use-clipboard-copy";

type props = {
  val: string
}

function Copy({ val = "" }: props) {
  const { copied, selectTextRef, onTextClk, onCopyClk } = useClipboardCopy()

  return (
    <div className="df bg-transparent border rounded-md">
      <input
        type="text"
        value={val}
        onChange={() => { }}
        ref={selectTextRef}
        onClick={onTextClk}
        className="text-sm px-2 py-1.5 text-white bg-transparent"
        readOnly
      />

      <button
        className="p-1 mr-2 bg-zinc-800"
        onClick={() => onCopyClk(val)}
      >
        {
          copied ? <LuCheck /> : <BiCopy />
        }
      </button>
    </div>
  )
}

export default Copy
