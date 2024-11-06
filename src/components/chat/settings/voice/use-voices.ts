import { useEffect, useState } from "react";

function useVoices() {
  const [voices, setVoices] = useState(() => {
    const synth = window?.speechSynthesis
    const allVoices = synth?.getVoices()
    return allVoices?.filter(voice => voice?.lang.startsWith('en-')) || []
  })

  useEffect(() => {
    setTimeout(() => {
      const synth = window?.speechSynthesis
      const allVoices = synth?.getVoices()
      const filtered = allVoices?.filter(voice => voice?.lang.startsWith('en-')) || []
      if (filtered.length > 0) {
        setVoices(filtered)
      }
    }, 300)
  }, [])

  return voices
}

export default useVoices
