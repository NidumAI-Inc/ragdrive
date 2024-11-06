import { FiDownload } from "react-icons/fi";

import constants from "../../../utils/constants";

import {
  Dialog,
  DialogContent,
} from "../../../components/ui/dialog";
import useUIStore from "../../../store/ui";

type props = {
  downloadImg: (f: string) => void
}

function ImgModel({ downloadImg }: props) {
  const { open, data, close } = useUIStore()

  return (
    <Dialog open={open === "img"} onOpenChange={close}>
      <DialogContent>
        <div className="pt-5 relative">
          <img
            alt=""
            src={`${constants.backendUrl}/image/img_gen/${data}`}
          />

          <button
            className='dc size-8 absolute bottom-1 right-1 rounded-full bg-black border border-white/10 hover:bg-input'
            onClick={() => downloadImg(data)}
          >
            <FiDownload />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImgModel
