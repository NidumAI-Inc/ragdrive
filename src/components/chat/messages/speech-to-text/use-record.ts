import { useEffect, useState } from 'react';

import { useAudioStore } from '../use-speech';

import { mediaRecorderService } from './MediaRecorderService';

function useRecord() {
  const update = useAudioStore(u => u.update)

  const [isSupported, setIsSupported] = useState(true)
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    const isBrowserSupported = () => {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    }

    const willRecordingWork = isBrowserSupported()
    setIsSupported(willRecordingWork)

    return () => {
      if (isRecording) {
        mediaRecorderService.cancelRecording().catch((e: any) => {
          // console.log(e)
        })
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      await mediaRecorderService.startRecording()
      setIsRecording(true)

    } catch (error) {
      console.error('Error starting recording:', error)
      setIsRecording(false)
    }
  }

  type sendToT = (v: Blob) => void
  const stopRecording = async (needTranscribe: boolean, sendTo: sendToT = () => { }) => {
    if (!needTranscribe) {
      mediaRecorderService.stopRecording()
      setIsRecording(false)
      return
    }

    try {
      const audioBlob = await mediaRecorderService.stopRecording()
      setIsRecording(false)
      sendTo?.(audioBlob)

    } catch (error) {
      console.error('Error stopping recording:', error)
      setIsRecording(false)
    }
  }

  const onClk = (sendTo: sendToT) => {
    if (isRecording) {
      stopRecording(true, sendTo)
      update({ needAutoPlay: true })
    } else {
      startRecording()
    }
  }

  return {
    isSupported,
    isRecording,
    onClk,
    stopRecording,
  }
}

export default useRecord
