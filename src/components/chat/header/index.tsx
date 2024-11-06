import ModelSelect from "./model-select";
import Create from "./create";

function Header() {
  return (
    <div className="df draggable px-4 py-2 border-b">
      <ModelSelect />
      <Create />
    </div>
  )
}

export default Header
