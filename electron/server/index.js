import express from 'express';
import cors from "cors";

import { checkPathsSetup } from './utils/path-helper';
import duckduckgo from "./controllers/duckduckgo";
import webcrawler from "./controllers/webcrawler";
import llamaChat from "./controllers/llama-chat";
import upgrade from "./controllers/upgrade";
import whisper from "./controllers/whisper";
import llama from "./controllers/llama";
import image from "./controllers/image";
import doc from "./controllers/doc";
import ai from "./controllers/ai";

const app = express()

checkPathsSetup()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/ai", ai)
app.use("/doc", doc)
app.use("/llama", llama)
app.use("/llama-chat", llamaChat)
app.use("/web-crawler", webcrawler)
app.use("/image", image)
app.use("/whisper", whisper)
app.use("/upgrade", upgrade)
app.use("/duckduckgo", duckduckgo)

export default app
