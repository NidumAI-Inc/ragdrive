import type { ImgGenMsg } from "../../../store/img-gen";
import UserQuery from "../messages/user-query";
import BotReply from "./bot-reply";
import Loading from "./loading";
import useUIStore from "../../../store/ui";

type props = {
  list: ImgGenMsg[]
  downloadImg: (v: string) => void
  deleteChat?: (v: string) => void
}

function List({ list = [], downloadImg, deleteChat = () => { } }: props) {
  const update = useUIStore(s => s.update)

  return list?.map((l: any) => {
    if (l.role === "user") {
      return (
        <UserQuery
          key={l.id}
          images={[]}
          isTemp={false}
          response={l.content}
          deleteChat={() => deleteChat(l.id)}
        />
      )
    }

    if (l.role === "loading") {
      return <Loading key={l.id} />
    }

    return (
      <BotReply
        key={l.id}
        response={l.content}
        openImg={() => update({ open: "img", data: l.content })}
        downloadImg={downloadImg}
        deleteChat={() => deleteChat(l.id)}
      />
    )
  })
}

export default List
