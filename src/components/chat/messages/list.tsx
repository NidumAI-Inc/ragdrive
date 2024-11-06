import type { Message } from "../../../store/conversations";
import LinkPreview from "./link-preview";
import UserQuery from "./user-query";
import BotReply from "./bot-reply";

import logo from '../../../assets/imgs/logo.png';

type props = {
  list: Message[]
  isTemp?: boolean
  deleteChat?: (v: string) => void
}

function List({ list = [], isTemp = false, deleteChat = () => { } }: props) {
  return list?.map((l: any) => {
    if (l.role === "user") {
      return (
        <UserQuery
          key={l.id}
          isTemp={isTemp}
          response={l.content}
          images={l.images}
          deleteChat={() => deleteChat(l.id)}
        />
      )
    }

    if (l.role === "web-searched") {
      return (
        <LinkPreview
          key={l.id}
          id={l.id}
          urls={l.webSearched}
        />
      )
    }

    if (l.role === "loading") {
      return (
        <div
          key={l.id}
          className="mb-6 group"
        >
          <div className="ml-9 py-2 relative">
            <div className="dc size-7 absolute top-1 -left-9 border rounded-full">
              <img
                alt=""
                src={logo}
                className="w-4"
              />
            </div>
            {
              [1, 2, 3, 4, 5, 6].map(p => (
                <p key={p} className="animate-msg mb-1.5 h-2 bg-white/20 rounded-sm"
                  style={{
                    width: `calc(100% - ${p * 40}px)`
                  }}
                ></p>
              ))
            }
            {/* <span className="mr-1 text-xs">Thinking</span>
            <span className="animate-ping text-2xl leading-3">.</span>
            <span className="animate-ping delay-75 text-2xl leading-3">.</span>
            <span className="animate-ping delay-100 text-2xl leading-3">.</span> */}
          </div>
        </div>
      )
    }

    return (
      <BotReply
        key={l.id}
        id={l.id}
        isTemp={isTemp}
        response={l.content}
        deleteChat={() => deleteChat(l.id)}
      />
    )
  })
}

export default List