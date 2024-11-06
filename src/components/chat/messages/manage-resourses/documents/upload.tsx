import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { nanoid } from 'nanoid';
import { LuX } from 'react-icons/lu';
import axios from 'axios';

import useContextStore from '../../../../../store/context';
import useConvoStore from '../../../../../store/conversations';
import constants from '../../../../../utils/constants';

function Upload() {
  const [loading, setLoading] = useState(false)
  const project_id = useContextStore(s => s.project_id)
  const oldFiles = useConvoStore(s => s.files[project_id])
  const addFile = useConvoStore(s => s.addFile)

  const [files, setFiles] = useState<File[]>([])

  const acceptedFileTypes = {
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    // 'application/vnd.ms-excel': ['.xls'],
    // 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    // 'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    // 'application/epub+zip': ['.epub'],
    'application/pdf': ['.pdf'],
    // 'text/markdown': ['.md'],
    'text/plain': ['.txt'],
  }

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) return;

    const newFiles = acceptedFiles.filter(file =>
      Object.keys(acceptedFileTypes).includes(file.type) ||
      Object.values(acceptedFileTypes).flat().includes(`.${file.name.split('.').pop()?.toLowerCase()}`)
    )
    setFiles(pre => [...pre, ...newFiles].slice(0, 4))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 4,
  })

  const upload = async () => {
    if (files.length > 0) {
      try {
        setLoading(true)
        const allowedFilenames: any = []
        const formData = new FormData()
        files.forEach(file => {
          allowedFilenames.push(file.name as never)
          formData.append("files", file)
        })
        if (oldFiles?.length) {
          allowedFilenames.push(...oldFiles?.map(s => s.name as never))
        }
        formData.append("allowedFilenames", JSON.stringify(allowedFilenames))

        await axios.post(`${constants.backendUrl}/doc/${project_id}`, formData)

        files.forEach(file => {
          addFile(project_id, {
            id: nanoid(10),
            name: file.name,
            size: file.size,
            type: file.type,
          })
        })

        setLoading(false)
        setFiles([])
      } catch (error) {
        // console.log(error)
        setLoading(false)
      }
    }
  }

  const removeFile = (j: number) => setFiles(p => p.filter((_, i) => i !== j))

  return (
    <div className='flex-1 text-xs'>
      <h6 className="mb-1 font-medium text-white/80">Add New Files</h6>

      <div
        className="dc flex-col mb-6 py-10 px-8 border rounded-md text-center text-white/60"
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <p>{isDragActive ? "Drop a files here..." : "Upload files (max 4): PDF, Word, Text. Drag and Drop or Click to Upload"}</p>
      </div>

      {files.map((file, index) => (
        <div key={index} className='df justify-between pl-2 py-0.5 hover:bg-input rounded-sm'>
          <p>{file.name.replace(/\\/g, '/').split('/').pop() || ""}</p>

          <button
            className='p-1 text-foreground hover:bg-red-500 hover'
            onClick={() => removeFile(index)}
            disabled={loading}
          >
            <LuX />
          </button>
        </div>
      ))}

      <button
        className="df px-12 py-1.5 mt-4 mx-auto bg-input hover:bg-input/80"
        onClick={upload}
        disabled={loading || files.length === 0}
      >
        {loading && <span className='loader-2'></span>}
        Upload
      </button>
    </div>
  );
}

export default Upload
