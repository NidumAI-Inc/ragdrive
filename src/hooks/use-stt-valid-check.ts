import { useEffect, useState } from "react";

function useSttValidCheck() {
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    const isBrowserSupported = () => {
      const list = navigator.userAgent.toLowerCase()
      const isEdgeOnMac = list.indexOf('edg') > -1 && list.indexOf('mac') > -1;
      const isFirefox = list.indexOf('firefox') > -1;
      // @ts-ignore
      return !isFirefox && !isEdgeOnMac && (!!window?.SpeechRecognition || !!window?.webkitSpeechRecognition);
    }

    setIsSupported(isBrowserSupported())
  }, [])

  return isSupported
}

export default useSttValidCheck
