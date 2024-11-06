import type { llm_modelsT } from "../store/context";
import anthropic from '../assets/imgs/anthropic.png';
import sambanova from '../assets/imgs/sambanova.png';
import openai from '../assets/imgs/openai.png';
import logo from '../assets/imgs/logo.png';
import groq from '../assets/imgs/groq.png';
import hf from '../assets/imgs/hugging-face.png';

type listT = {
  id: string
  title: llm_modelsT
  logo: string
  para: string
}

const llmModels: listT[] = [
  {
    id: "1",
    logo: logo,
    title: "Ollama",
    para: "Run AI models locally on your machine"
  },
  {
    id: "4",
    logo: sambanova,
    title: "SambaNova Systems",
    para: "Inference API from SambaNova Systems"
  },
  {
    id: "2",
    logo: groq,
    title: "Groq",
    para: "Run inference on Groq LPUs"
  },
  {
    id: "3",
    logo: hf,
    title: "Hugging Face",
    para: "Inference API from Hugging Face (Serverless)"
  },
  {
    id: "6",
    logo: openai,
    title: "OpenAI",
    para: "Inference API from OpenAI"
  },
  {
    id: "5",
    logo: anthropic,
    title: "Anthropic",
    para: "Inference API from Anthropic"
  },
  // {
  //   id: "3",
  //   logo: "/logo.png",
  //   title: "Nidum",
  //   para: "Best uncensored inferencing for Agents and Tools"
  // },
]

export default llmModels