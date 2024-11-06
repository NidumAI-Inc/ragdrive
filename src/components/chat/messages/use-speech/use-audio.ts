import { useEffect, useRef } from "react";
import useAudioStore from "./use-audio-store";
import useContextStore from "../../../../store/context";
import delay from "../../../../utils/delay";

function useAudio() {
  const isSpeaking = useAudioStore(s => s.isSpeaking)
  const update = useAudioStore(s => s.update)
  const clear = useAudioStore(s => s.clear)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const voice = useContextStore(s => s.voice)

  useEffect(() => {
    return () => {
      const synth = window.speechSynthesis;
      synth.cancel()
      clear()
    }
  }, [])

  function removeMarkdown(text: string): string {
    return text.replace(/[*_`#\[\]()~>]/g, '');
  }

  async function speak(id: string, text: string) {
    if (!text) return;

    await delay(500)
    const synth = window.speechSynthesis;
    // if (synth.speaking) return;
    const allVoices = synth.getVoices()
    const englishVoices = allVoices.filter(voice => voice.lang.startsWith('en-'));

    update({ isSpeaking: true, botResId: id })

    const chunkSize = 170;
    const chunks: string[] = [];
    let currentChunk = '';
    const words = text.split(' ');
    for (const word of words) {
      if (currentChunk.length + word.length + 1 <= chunkSize) {
        currentChunk += (currentChunk ? ' ' : '') + word;
      } else {
        chunks.push(currentChunk.trim());
        currentChunk = word;
      }
    }
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    const speakChunk = (index: number) => {
      if (index < chunks.length) {
        const txt = chunks[index] as string
        const cleanedTxt = removeMarkdown(txt)
        utteranceRef.current = new SpeechSynthesisUtterance(cleanedTxt)

        utteranceRef.current.onend = () => {
          speakChunk(index + 1)
        }
        utteranceRef.current.onerror = () => clear()

        // @ts-ignore
        utteranceRef.current.voice = englishVoices.find(s => s.name === voice) || englishVoices[0]

        synth.speak(utteranceRef.current)

      } else {
        clear()
      }
    }

    speakChunk(0)
  }

  function onClkSpeakBtn(id: string, response: string) {
    if (isSpeaking) {
      const synth = window.speechSynthesis;
      synth.cancel();
      clear()
      return;
    }
    speak(id, response)
  }

  return { speak, onClkSpeakBtn }
}

export default useAudio
