
const keyFeatures = [
  {
    title: "Unrestricted Responses:",
    para: "Address any query with detailed, unrestricted responses, providing a broad spectrum of information and insights."
  },
  {
    title: "Versatility:",
    para: "Capable of engaging with a diverse range of topics, from complex scientific questions to casual conversation."
  },
  {
    title: "Advanced Understanding:",
    para: "Leverages a vast knowledge base to deliver contextually relevant and accurate outputs across various domains."
  },
  {
    title: "Customizability:",
    para: "Adaptable to specific user needs and preferences for different types of interactions.  "
  },
]

const useCases = [
  "Open-Ended Q&A",
  "Creative Writing and Ideation",
  "Research Assistance",
  "Educational and Informational Queries",
  "Casual Conversations and Entertainment",
]

function Nidum() {
  return (
    <div>
      <div className="text-[13px] leading-5 tracking-wider my-8">
        <h6 className="mb-2 text-sm text-primary">Description:</h6>

        <p>Nidum-Limitless-Gemma-2B is an advanced language model that provides unrestricted and versatile responses across a wide range of topics. Unlike conventional models, Nidum-Limitless-Gemma-2B is designed to handle any type of question and deliver comprehensive answers without content restrictions.</p>
      </div>

      <div className="mb-8">
        <h6 className="mb-2 text-sm text-primary">Key Features:</h6>
        <ol className="pl-4 list-decimal">
          {
            keyFeatures.map(k => (
              <li
                key={k.title}
                className="mb-2 text-xs text-white/70"
              >
                <strong className=" text-white/90">{k.title}</strong> {k.para}
              </li>
            ))
          }
        </ol>
      </div>

      <div className="mb-8">
        <h6 className="mb-2 text-sm text-primary">Key Features:</h6>
        <ul className="pl-4 list-disc">
          {
            useCases.map(k => (
              <li
                key={k}
                className="mb-2 text-xs text-white/70"
              >
                {k}
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default Nidum
