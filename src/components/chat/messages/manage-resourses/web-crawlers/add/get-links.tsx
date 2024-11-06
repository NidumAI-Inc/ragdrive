import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { getSubLinks } from '../../../../../../actions/webcrawler';
// import { useCrawler } from '../../../../../../hooks/use-crawler';
import useContextStore from '../../../../../../store/context';
import { useAddCrawl } from '../../../../../../hooks/use-crawler';
import { useToast } from '../../../../../ui/use-toast';

import { Switch } from '../../../../../ui/switch';

type props = {
  updateLinks: (v: string[]) => void
}

function GetLinks({ updateLinks }: props) {
  const projectId = useContextStore(s => s.project_id)

  // const { data: crawledLinks, isLoading } = useCrawler()
  const { toast } = useToast()

  const [onlyThisPage, setOnlyThisPage] = useState(true)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      url: "",
      maxRequestsPerCrawl: 1,
    }
  })

  const { mutate: mutateaAdd, isPending: isCrawling } = useAddCrawl()

  const { isPending, mutate } = useMutation({
    mutationFn: getSubLinks,
    onSuccess(res) {
      if (res.links.length > 0) {
        updateLinks(res.links)
      } else {
        toast({
          title: "No pages/links found",
          description: "Try with sub links"
        })
      }
    }
  })

  const onSubmit = (data: any) => {
    if (onlyThisPage) {
      mutateaAdd(
        {
          urls: [data.url],
          folderName: projectId
        },
        {
          onSettled() {
            reset()
          }
        }
      )

    } else {
      // const origin = new URL(data.url).origin
      // const excludedLinks: string[] = crawledLinks?.[origin] || []

      mutate({
        ...data,
        // excludedLinks,
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='text-xs'
    >
      <div className="mb-2">
        <label className="block mb-1 font-medium text-white/80">URL</label>

        <input
          type="url"
          className="bg-input/70"
          placeholder="https://example.com"
          {...register("url", {
            required: "Website URL is required",
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Enter a valid URL starting with http:// or https://"
            }
          })}
        />
        {errors.url && <p className="text-red-500 mt-1">{errors.url.message}</p>}
      </div>

      <div className='df justify-end mb-4'>
        <label className="block mb-1 font-medium text-white/80">Only the above URL</label>
        <Switch
          className=' w-8 h-4'
          checked={onlyThisPage}
          onCheckedChange={setOnlyThisPage}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-white/80">No. of Sub Pages</label>

        <input
          min={1}
          step={1}
          className="bg-input/70"
          placeholder="4"
          disabled={onlyThisPage}
          {...register("maxRequestsPerCrawl", {
            valueAsNumber: true,
            required: "Number of sub pages is required",
            min: { value: 1, message: "Minimum value is 1" },
            max: { value: 100, message: "Maximum value is 100" }
          })}
        />
        {errors.maxRequestsPerCrawl && <p className="text-red-500 mt-1">{errors.maxRequestsPerCrawl.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending || isCrawling} //  || isLoading
        className="df px-12 py-1.5 mt-4 mx-auto bg-input hover:bg-input/80"
      >
        {isPending && <span className='loader-2'></span>}
        {onlyThisPage ? "Crawle Page" : "Fetch Pages"}
      </button>
    </form>
  )
}

export default GetLinks
