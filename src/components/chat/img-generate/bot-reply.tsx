import { MdDeleteOutline } from "react-icons/md";
import { FiDownload } from "react-icons/fi";

import constants from "../../../utils/constants";

import logo from '../../../assets/imgs/logo.png';

type props = {
  response: string
  openImg: () => void
  downloadImg: (f: string) => void
  deleteChat?: () => void
}

function BotReply({ response, openImg, downloadImg, deleteChat = () => { } }: props) {
  return (
    <div className="mb-6 group">
      <div className="w-fit max-w-[88%] py-2 ml-9 relative">
        <div className="dc size-7 absolute top-1 -left-9 border rounded-full">
          <img
            alt=""
            src={logo}
            className="w-4"
          />
        </div>

        <img
          alt=""
          src={`${constants.backendUrl}/image/img_gen/${response}`}
          className="size-80 rounded-md border border-white/10 cursor-pointer"
          onClick={openImg}
        />
      </div>

      <div className='df gap-4 ml-8 opacity-0 group-hover:opacity-100 text-white/60'>
        <button
          className='df gap-1 text-[12px] p-0 hover:text-white'
          onClick={() => downloadImg(response)}
        >
          <FiDownload />
        </button>

        <button
          className="p-0 hover:text-white"
          onClick={deleteChat}
        >
          <MdDeleteOutline />
        </button>
      </div>
    </div>
  )
}

export default BotReply
