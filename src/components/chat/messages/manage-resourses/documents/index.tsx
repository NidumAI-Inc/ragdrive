import Upload from "./upload";
import List from './list';

function Documents() {
  return (
    <div className='flex flex-col md:flex-row gap-8'>
      <Upload />
      <List />
    </div>
  )
}

export default Documents
