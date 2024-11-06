import useIsFullScreenCheck from '../../hooks/use-is-full-screen-check';
import usePlatform from '../../hooks/use-platform';

import SideBar from '../../assets/svg/sidebar.svg?react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

function SideNavToggler() {
  const isFullScreen = useIsFullScreenCheck()
  const platform = usePlatform()

  function toggleNav() {
    document.body?.classList.toggle("open")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={`side-nav-toggle fixed top-2.5 ${isFullScreen ? "left-3" : platform === "windows" ? "left-3" : "left-[72px]"} p-1 text-lg z-[2]`}
          onClick={toggleNav}
        >
          <SideBar />
        </TooltipTrigger>

        <TooltipContent side="right">
          <p className='sidebar-content text-xs'></p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default SideNavToggler
