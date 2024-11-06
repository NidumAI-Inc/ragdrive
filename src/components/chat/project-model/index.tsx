import { useForm, Controller, useWatch } from 'react-hook-form';

import useConvoStore from '../../../store/conversations';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { systemDefaultPrompt } from '../../../utils/improve-context';

const list = [
  "General",
  "Research",
  "Education",
  "Programming",
  "Customer Support",
  "Creative Writing",
  "Development",
  "Marketing",
  "Learning",
  "Hobby",
  "Other"
]

type props = {
  open: boolean
  closeModel: () => void
  id?: string
  data?: {
    name: string
    other: string
    category: string
    description: string
    systemPrompt: string
  }
}

function ProjectModel({ data, id, open, closeModel }: props) {
  const { register, control, formState: { errors }, reset, handleSubmit } = useForm({
    defaultValues: {
      name: data?.name || "",
      other: data?.other || "",
      category: data?.category || "",
      description: data?.description || "",
      systemPrompt: data?.systemPrompt || systemDefaultPrompt,
    }
  })

  const category = useWatch({
    control,
    name: "category",
  })

  const editProject = useConvoStore(s => s.editProject)
  const addProject = useConvoStore(s => s.addProject)

  const onSubmit = (data: any) => {
    if (id) editProject(id, data)
    else addProject(data)
    resetAndClose()
  }

  function resetAndClose() {
    reset({
      name: "",
      other: "",
      category: "",
      description: "",
      systemPrompt: systemDefaultPrompt,
    })
    closeModel()
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{id ? "Edit" : "Create"} Project</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">Name</label>
            <input
              type="text"
              className="px-2.5 py-1.5 text-sm bg-transparent border"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 charcters need to be filled"
                }
              })}
            />
            {
              errors.name &&
              <p className='text-xs text-red-400'>{errors.name.message}</p>
            }
          </div>

          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">Category</label>
            <Controller
              name="category"
              control={control}
              rules={{
                required: "Category is required"
              }}
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {
                      list.map(l => (
                        <SelectItem
                          key={l}
                          value={l}
                        >
                          {l}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              )}
            />
            {
              errors.category &&
              <p className='text-xs text-red-400'>{errors.category.message}</p>
            }
          </div>

          {
            category === "Other" &&
            <div className='mb-6'>
              <label htmlFor="" className="mb-0.5 text-xs">Other's Name</label>
              <input
                type="text"
                className='px-2.5 py-1.5 text-sm bg-transparent border'
                {...register("other", {
                  required: "Other's Name is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 charcters need to be filled"
                  }
                })}
                maxLength={20}
              />
              {
                errors?.other &&
                <p className='text-xs text-red-400'>{errors?.other?.message}</p>
              }
            </div>
          }

          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">Description</label>
            <textarea
              className="h-20 px-2.5 py-1.5 text-sm bg-transparent border resize-none"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 15,
                  message: "Minimum 15 charcters need to be filled"
                }
              })}
            />
            {
              errors.description &&
              <p className='text-xs text-red-400'>{errors.description.message}</p>
            }
          </div>

          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">System Prompt</label>
            <textarea
              className="h-20 px-2.5 py-1.5 text-sm bg-transparent border resize-none"
              {...register("systemPrompt")}
            />
          </div>

          <button
            className='block mx-auto py-1.5 px-6 text-sm font-medium rounded-full bg-input hover:bg-input/70 disabled:opacity-60'
          >
            {id ? "Edit" : "Create"} Project
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectModel
