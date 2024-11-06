import useUIStore from "../../../../store/ui";

type props = {
  onSave: () => void
}

function Footer({ onSave }: props) {
  const close = useUIStore(s => s.close)

  function onSubmit() {
    onSave()
    close()
  }

  return (
    <div className="df justify-between mt-12 mb-4">
      <button
        onClick={close}
        className="w-20 py-1.5 text-[13px] text-white/70 border hover:text-white hover:bg-input"
      >
        Cancel
      </button>

      <button
        className="w-20 py-1.5 text-[13px] bg-black/60 hover:bg-input"
        onClick={onSubmit}
      >
        Save
      </button>
    </div>
  )
}

export default Footer
