import useContextStore from "../../../../store/context";
import useConvoStore from "../../../../store/conversations";

function useSystemPrompt() {
  const project_id = useContextStore(s => s.project_id)
  const chat_id = useContextStore(s => s.chat_id)

  const webEnabled = useConvoStore(s => s.projects[project_id]?.web_enabled || "")
  const ragEnabled = useConvoStore(s => s.projects[project_id]?.rag_enabled || "")

  const systemPrompt = useConvoStore(s => s.projects[project_id]?.systemPrompt || "")
  const webPrompt = useConvoStore(s => s.projects[project_id]?.webPrompt || "")
  const ragPrompt = useConvoStore(s => s.projects[project_id]?.ragPrompt || "")

  const editProject = useConvoStore(s => s.editProject)

  const onChange = (v: string) => {
    let key = ragEnabled ? "ragPrompt" : webEnabled ? "webPrompt" : "systemPrompt"
    editProject(project_id, { [key]: v })
  }

  return {
    isDisabled: chat_id?.endsWith("-imgGen"),
    prompt: ragEnabled ? ragPrompt : webEnabled ? webPrompt : systemPrompt,
    onChange,
  }
}

export default useSystemPrompt
