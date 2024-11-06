import useContextStore from "../../../../store/context";

import SelectModel from "./select-model";
import HuggingFace from "./hugging-face";
import SambavaNova from "./sambanova";
import Anthropic from "./anthropic";
// import Nidum from "./nidum";
import Ollama from "./ollama";
import OpenAI from "./openai";
import Groq from "./groq";

function Model() {
  const modelType = useContextStore(s => s.model_type)

  return (
    <>
      <SelectModel />

      {
        modelType === "Ollama" && <Ollama />
      }

      {
        modelType === "Groq" && <Groq />
      }

      {
        modelType === "Hugging Face" && <HuggingFace />
      }

      {
        modelType === "SambaNova Systems" && <SambavaNova />
      }

      {
        modelType === "Anthropic" && <Anthropic />
      }

      {
        modelType === "OpenAI" && <OpenAI />
      }

      {/* {
        modelType === "Nidum" && <Nidum />
      } */}
    </>
  )
}

export default Model
