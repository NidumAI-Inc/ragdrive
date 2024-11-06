import List from "./list";
import Add from "./add";

function WebCrawlers() {
  return (
    <div className='grid md:grid-cols-2 gap-8'>
      <Add />
      <List />
    </div>
  )
}

export default WebCrawlers
