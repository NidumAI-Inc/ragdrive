import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { crawleWeb, deletedCrawledLinks, getCrawledLinks, getLinkPreview } from "../actions/webcrawler";
import useContextStore from "../store/context";
import { groupLinks, sortUrlsByPathname } from "../utils/url-helper";
import { useToast } from "../components/ui/use-toast";

export function useCrawler() {
  const projectId = useContextStore(s => s.project_id)

  return useQuery({
    queryKey: ["get-crawled-list", projectId],
    queryFn: () => getCrawledLinks(projectId),
    enabled: !!projectId,
    select: res => {
      const data = groupLinks(res)
      Object.keys(data).forEach(key => {
        data[key] = sortUrlsByPathname(data[key])
      })

      return data
    },
  })
}

export function useAddCrawl() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: crawleWeb,
    onSuccess(res, variables) {
      queryClient.invalidateQueries({ queryKey: ["get-crawled-list", variables.folderName] })
      toast({
        title: "Page(s) successfully crawled"
      })
    },
    onError(err) {
      toast({
        // @ts-ignore
        title: err?.response?.data?.error || "Something went wrong!"
      })
    }
  })
}

export function useDeleteCrawledLinks() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deletedCrawledLinks,
    onSuccess(res, variables) {
      queryClient.invalidateQueries({ queryKey: ["get-crawled-list", variables.folderName] })
      toast({
        title: "Deleted selected links"
      })
    },
    onError(err) {
      toast({
        // @ts-ignore
        title: err?.response?.data?.error || "Something went wrong!"
      })
    }
  })
}

export function usePreviewLinks(url: string) {
  return useQuery({
    queryKey: ["link-preview", url],
    queryFn: () => getLinkPreview(url),
    enabled: !!url,
  })
}
