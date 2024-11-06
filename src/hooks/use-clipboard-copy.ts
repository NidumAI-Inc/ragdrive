import { useRef, useState } from 'react';

function useClipboardCopy() {
  const [copied, setCopied] = useState(false)
  const selectTextRef = useRef<HTMLInputElement>(null)

  const onCopyClk = (txt: string) => {
    setCopied(true)
    navigator.clipboard.writeText(txt)
    setTimeout(() => {
      setCopied(false)
    }, 2500)
  }

  // @ts-ignore
  const onTextClk = () => selectTextRef?.current?.select?.()

  return { copied, onCopyClk, selectTextRef, onTextClk }
}

export default useClipboardCopy