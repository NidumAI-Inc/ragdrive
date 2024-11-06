import { useState } from "react";
import useContextStore from "../../../../store/context";

import MarkdownParse from "../../../../components/chat/messages/bot-reply/markdown-parse";
import Footer from "../common/footer";

const markdown = `
### How to Get Started with Qdrant Locally

In this short example, you will use the Python Client to create a collection, load data into it, and run a basic search query.

#### Prerequisites
Before you start, please ensure that Docker is installed and running on your system.

#### Download and Run Qdrant

1. **Download the latest Qdrant image from Dockerhub:**

   \`\`\`bash
   docker pull qdrant/qdrant
   \`\`\`

2. **Run the Qdrant service:**

   \`\`\`bash
   docker run -p 6333:6333 -p 6334:6334 \
   -v $(pwd)/qdrant_storage:/qdrant/storage:z \
   qdrant/qdrant
   \`\`\`

   - Under the default configuration, all data will be stored in the \`./qdrant_storage\` directory. This is the only directory visible to both the Container and the host machine.

#### CORS Error Note
**Note:** Sometimes, while using Qdrant DB (both cloud and local versions), you may encounter CORS (Cross-Origin Resource Sharing) errors. To resolve this issue, you can either:

1. **Use a Tunnel:** Establish a tunnel to bypass CORS restrictions.
2. **Contact Support:** Raise a ticket with your Qdrant DB provider for further assistance.
`

function Qdrant() {
  const updateContext = useContextStore(s => s.updateContext)
  const qdrantDBApiKey = useContextStore(s => s.qdrantDBApiKey)
  const qdrantDBUrl = useContextStore(s => s.qdrantDBUrl)

  const [details, setDetails] = useState({
    qdrantDBApiKey,
    qdrantDBUrl,
  })

  function onChange(payload: Record<string, any>) {
    setDetails(pr => ({
      ...pr,
      ...payload,
    }))
  }

  function onSave() {
    updateContext(details)
  }

  return (
    <>
      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs">Qdrant DB URL</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="http://123.45.567.89:6334"
          value={details.qdrantDBUrl}
          onChange={e => onChange({ qdrantDBUrl: e.target.value })}
        />
      </div>

      <div className="mb-12">
        <label htmlFor="" className="mb-0.5 text-xs">Qdrant DB Api Key</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="giueHUGOrt_ouyFYJqagetouq"
          value={details.qdrantDBApiKey}
          onChange={e => onChange({ qdrantDBApiKey: e.target.value })}
        />
      </div>

      <MarkdownParse
        response={markdown}
      />

      <Footer onSave={onSave} />
    </>
  )
}

export default Qdrant
