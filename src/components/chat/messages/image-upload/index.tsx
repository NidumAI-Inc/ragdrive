import { useCallback, Dispatch, SetStateAction, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { BiImageAdd, BiX } from "react-icons/bi";

import { deleteImg, uploadImg } from '../../../../actions/img';
import { nanoid } from 'nanoid';

type props = {
  files: File[]
  message: string
  loading: boolean
  setFiles: Dispatch<SetStateAction<File[]>>
}

function ImageUpload({ message, loading, files, setFiles }: props) {
  const acceptedFileTypes = {
    'image/*': ['.png', ".jpg", ".jpeg", ".webp"],
  }

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) return;

    const renameFile = (file: File): File => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const newFileName = `${nanoid(10)}.${fileExtension}`;
      return new File([file], newFileName, { type: file.type });
    }

    const newFiles = acceptedFiles.filter(file => Object.values(acceptedFileTypes).flat().includes(`.${file.name.split('.').pop()?.toLowerCase()}`)).map(renameFile)
    setFiles(prev => {
      const updatedFiles = [...prev]
      newFiles.forEach(newFile => {
        const isDuplicate = updatedFiles.some(
          existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size
        )
        if (!isDuplicate) {
          updatedFiles.push(newFile)
        }
      })
      return updatedFiles.slice(0, 4)
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 4,
  })

  useEffect(() => {
    if (files.length > 0) {
      uploadImg(files)
    }
  }, [files])

  const removeFile = (file: File) => {
    deleteImg(file.name)
    setFiles(p => p.filter(f => f.name !== file.name))
  }

  return (
    <>
      <div className="df px-2 pt-2 mb-2 absolute left-0 bottom-full backdrop-blur-sm rounded">
        {
          files.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Uploaded ${index + 1}`}
                className="w-16 h-16 object-cover rounded"
              />
              <button
                onClick={() => removeFile(file)}
                className="absolute -top-1 -right-1 bg-input hover:bg-red-400 text-white rounded-full p-1"
              >
                <BiX />
              </button>
            </div>
          ))
        }
      </div>

      {
        !message && !loading &&
        <div
          className="dc w-8 h-8 p-0 shrink-0 absolute right-1 top-1 text-xl rounded-full bg-secondary text-white/70 cursor-pointer hover:bg-input disabled:cursor-not-allowed"
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          <BiImageAdd />
        </div>
      }
    </>
  )
}

export default ImageUpload
