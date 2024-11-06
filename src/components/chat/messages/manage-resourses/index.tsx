import { IoIosAttach } from "react-icons/io";

import useContextStore from "../../../../store/context";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import WebCrawlers from "./web-crawlers";
import Documents from "./documents";

function FileUpload() {
  const project_id = useContextStore(s => s.project_id)

  return (
    <Dialog>
      <DialogTrigger
        className="dc w-8 h-8 p-0 shrink-0 text-xl rounded-full bg-secondary cursor-pointer hover:bg-input disabled:cursor-not-allowed"
        disabled={!project_id}
      >
        <IoIosAttach className="cursor-[inherit] text-white/60" />
      </DialogTrigger>

      <DialogContent className="md:max-w-3xl lg:max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">
            Manage Resources
          </DialogTitle>
          <DialogDescription className=" text-xs text-white/60">Manage documents and web crawlers</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="Documents">
          <TabsList className="p-0 h-auto mb-8 bg-transparent">
            {
              ["Documents", "Web Crawlers"].map(l => (
                <TabsTrigger
                  className="m-0 text-white/60 bg-transparent border-b-2 border-transparent rounded-none hover:text-white/80 data-[state=active]:border-white"
                  value={l}
                  key={l}
                >
                  {l}
                </TabsTrigger>
              ))
            }
          </TabsList>

          <TabsContent value="Documents">
            <Documents />
          </TabsContent>

          <TabsContent value="Web Crawlers">
            <WebCrawlers />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default FileUpload
