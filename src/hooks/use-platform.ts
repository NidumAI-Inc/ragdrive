import { useEffect, useState } from "react";

function usePlatform() {
  const [platform, setPlatform] = useState("")

  useEffect(() => {
    const navi = navigator.userAgent.toLowerCase()
    let final = ""

    if (navi.includes("mac")) {
      final = "mac"
    } else if (navi.includes("windows")) {
      final = "windows"
    }

    setPlatform(final)
  }, [])

  return platform
}

export default usePlatform