import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { isLatestVersionAvailable } from "../../../actions/upgrade";
import { useDownloads } from "../../common/download-manager";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";

import logo from '../../../assets/imgs/logo.png';

function CheckForUpdate() {
  const { downloadLatestExec } = useDownloads()
  const [isLater, setIsLater] = useState(false)
  const queryClient = useQueryClient()

  const { data: isLatestExec } = useQuery({
    queryKey: ["version-check"],
    queryFn: isLatestVersionAvailable,
  })

  function downloadIt() {
    downloadLatestExec(isLatestExec?.url)
    setIsLater(true)
    queryClient.invalidateQueries({ queryKey: ["version-check"] })
  }

  if (!(isLatestExec?.hasLatest && !isLater)) return null

  return (
    <Dialog open onOpenChange={() => setIsLater(true)}>
      <DialogContent className="max-w-xs p-4 text-center">
        <DialogHeader className="mb-2">
          <img
            className="w-16 mb-2 mx-auto mt-6"
            src={logo}
            alt=""
          />
          <DialogTitle className="text-sm">New Verion Available</DialogTitle>
          <DialogDescription className="text-xs">
            Do you want to download it now?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className=" justify-center">
          <button
            className="w-20 py-1.5 text-xs border hover:bg-input"
            onClick={() => setIsLater(true)}
          >
            Later
          </button>

          <button
            onClick={downloadIt}
            className="w-20 py-1.5 text-xs bg-black hover:bg-green-800/60"
          >
            Download
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CheckForUpdate
