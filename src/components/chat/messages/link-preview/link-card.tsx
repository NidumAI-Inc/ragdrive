import { usePreviewLinks } from "../../../../hooks/use-crawler";
import { Skeleton } from "../../../ui/skeleton";

type props = {
  url: string
  isBig?: boolean
}

function LinkCard({ url, isBig }: props) {
  const { isLoading, data: metadata } = usePreviewLinks(url)

  const len = metadata ? Object.values(metadata).filter(Boolean).length : 0
  const hasData = len > 0

  if (isLoading) {
    return <Skeleton className="h-16 rounded-md bg-zinc-800" />
  }

  if (!hasData) {
    return (
      <a className="dfc gap-1 px-2.5 py-1.5 text-[11px] rounded-md bg-zinc-800" href={url} target="_blank">
        <div className="flex-1 leading-4 line-clamp-2 opacity-55">Cannot preview informations</div>

        <div className="df gap-1">
          <span className="size-4 bg-gray-700 rounded-full"></span>
          <span className="flex-1 truncate">{url}</span>
        </div>
      </a>
    )
  }

  return (
    <a className="dfc gap-1 px-2.5 py-1.5 text-[11px] rounded-md bg-zinc-800" href={url} target="_blank">
      <div className="flex-1 text-balance leading-4 line-clamp-2 opacity-90">{metadata?.title}</div>
      {
        isBig &&
        <div className="my-1 line-clamp-3 opacity-70">{metadata?.description}</div>
      }
      <div className="df gap-1">
        <img
          className="size-4 rounded-full"
          src={metadata?.favicon}
        />
        <p className="flex-1 truncate">{metadata?.siteName || url}</p>
      </div>
    </a>
  )
}

export default LinkCard
