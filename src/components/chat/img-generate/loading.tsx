import { Skeleton } from "../../../components/ui/skeleton";
import logo from '../../../assets/imgs/logo.png';

function Loading() {
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

        <div className=" relative">
          <p className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">Generating...</p>
          <Skeleton className="size-80 rounded-md border border-white/10" />
        </div>
      </div>
    </div>
  )
}

export default Loading
