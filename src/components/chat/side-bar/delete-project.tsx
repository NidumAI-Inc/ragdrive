
import useContextStore from "../../../store/context";
import useConvoStore from "../../../store/conversations";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";

type props = {
  id: string
  closeModel: () => void
}

function DeleteProject({ id, closeModel }: props) {
  const project_id = useContextStore(s => s.project_id)
  const updateContext = useContextStore(s => s.updateContext)
  const deleteProject = useConvoStore(s => s.deleteProject)

  function onConfirm() {
    deleteProject(id)
    if (project_id === id) {
      updateContext({ project_id: "", chat_id: "" })
    }
    closeModel()
  }

  return (
    <Dialog open onOpenChange={closeModel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription className="text-white/60">
            Are you sure you want to delete this project?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            className="px-3 py-1.5 text-sm bg-input hover:bg-input/70"
            onClick={closeModel}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1.5 text-sm bg-red-400 hover:bg-red-500"
            onClick={onConfirm}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProject
