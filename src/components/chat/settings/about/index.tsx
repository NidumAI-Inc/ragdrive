import { FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

import packageJson from '../../../../../package.json';

const list = [
  {
    id: "1",
    icon: <FaXTwitter className="text-3xl" />,
    link: "https://x.com/AiNidum",
  },
  {
    id: "2",
    icon: <MdOutlineEmail className="text-4xl" />,
    link: "mailto:info@nidum.ai",
  },
  {
    id: "3",
    icon: <FaTelegramPlane className="text-4xl" />,
    link: "https://t.me/nidumai",
  },
  {
    id: "4",
    icon: <FaLinkedin className="text-3xl" />,
    link: "https://www.linkedin.com/company/nidum-ai",
  },
]

function About() {
  return (
    <div className="text-xs text-white/80">
      <p className="mb-4">Current Version: Nidum AI Version {packageJson.version} (Codename - Madurai)</p>
      <p className="mb-4">Hi there! We are a small bootstrapped startup of mostly sober geeks and we hope you have as much fun using Nidum AI as we did creating this for you.</p>
      <p className="mb-4">Watch it in a small video: <a className=" text-blue-300/80 hover:text-blue-300" href="https://youtu.be/RAar8QIUIzw?si=NdfbxONCWshP1KAP" target="_blank">https://youtu.be/RAar8QIUIzw?si=NdfbxONCWshP1KAP</a></p>
      <p className="mb-4">Our goal is to bring AI with RAG and Agents to all. Not just the developers and AI enthusiasts but every end user. We are right now the World's First and ONLY edge no-code Local AI Studio that supports Documents and Image RAG.</p>

      <p className="mb-4">What's in the next update:</p>
      <p className="mb-4">Our GenAI Store is going to be launched soon in this same app you're using. It will allow thousands of developers to build and launch apps that can be used inside of this no-code AI Studio. A promising startup have already been greenlit by our community to launch their AI Chat Bot that you can use on your website to support your customers/leads via Zendesk, Salesforce, Zoho, Freshworks, Shopify, LiveChatInc and more. With this, you can setup autonomous agents that run on your knowledge base on your computer which will be free forever, helping you supercharge your business.</p>
      <p className="mb-4">There will also be Text to Image and Video support in your Nidum AI in the near future.</p>

      <p className="mb-1">If you need support, please use any one of the following channels:</p>
      <p className="df gap-4 mb-5">
        {
          list.map(l => (
            <a
              key={l.id}
              href={l.link}
              className="hover:text-white"
              target="_blank"
            >
              {l.icon}
            </a>
          ))
        }
      </p>

      <p className="mb-4">If you want to launch your plugins in Nidum AI, get in touch with us.</p>
    </div>
  )
}

export default About
