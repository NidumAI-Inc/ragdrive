import { toast } from "sonner";
import axios from "axios";

import useContextStore from "../store/context";
import constants from "../utils/constants";

export async function initSetup() {
  try {
    const response = await fetch(`${constants.backendUrl}/nidum`)
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader?.read() || {}
      if (done) {
        // console.log("at done")
        break;
      }

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          try {
            const jsonData = JSON?.parse(data)
            if (jsonData?.progress) {
              let perc = Number(jsonData?.progress)
              if (perc === 100) {
                toast.success("Initial setup on process", {
                  className: "py-2",
                  description: `Setup completed successfully`,
                  richColors: true,
                  position: "top-center",
                  duration: 1000,
                  id: "init-setup",
                })
              } else {
                toast.loading("Initial setup on process", {
                  className: "py-2",
                  description: `Progress: ${perc}%`,
                  richColors: false,
                  position: "top-center",
                  duration: Infinity,
                  id: "init-setup",
                })
              }
            }
            if (jsonData?.error) {
              toast.error("Initial setup on process", {
                className: "py-2",
                description: jsonData?.error,
                richColors: true,
                position: "top-center",
                duration: 1000,
                id: "init-setup",
              })
            }
          } catch (err) { }
        }
      }
    }

    return true
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getOllamaTags(ollamaUrl: string) {
  return axios.get(`${ollamaUrl}/api/tags`).then(r => r.data.models)
}

export async function deleteModel(name: string) {
  const ollamaUrl = useContextStore.getState().ollamaUrl

  return axios.delete(`${ollamaUrl}/api/delete`, {
    data: { name }
  }).then(r => r.data)
}
