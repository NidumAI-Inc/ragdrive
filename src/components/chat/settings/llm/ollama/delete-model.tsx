import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDownloadedModel } from "../../../../../actions/llms";
import { useToast } from "../../../../../components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../../components/ui/dialog";

type props = {
  id: string
  closeModel: (i: string) => void
  cancelModel: () => void
}

function DeleteModel({ id, cancelModel, closeModel }: props) {
  const quryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteDownloadedModel(id),
    onSuccess() {
      toast({ title: "Model deleted successfully" })
      quryClient.invalidateQueries({ queryKey: ["llama-models-downloaded"] })
      closeModel(id)
    },
    onError(err) {
      console.log(err)
    }
  })

  return (
    <Dialog open onOpenChange={cancelModel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Model</DialogTitle>
          <DialogDescription className="text-white/60">
            Are you sure you want to delete this model?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            className="px-3 py-1.5 text-sm bg-input hover:bg-input/70"
            onClick={cancelModel}
            disabled={isPending}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1.5 text-sm bg-red-400 hover:bg-red-500"
            onClick={() => mutate()}
            disabled={isPending}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteModel
