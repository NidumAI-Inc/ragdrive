import useIsFullScreenCheck from "../../../hooks/use-is-full-screen-check";
import usePlatform from "../../../hooks/use-platform";
import useResizable from "./use-resizable";

import SideNavToggler from "../../../components/common/side-nav-toggler";
import Histories from "./histories";
import Projects from "./projects";

function SideBar() {
  const isFullScreen = useIsFullScreenCheck()
  const platform = usePlatform()

  const { resizedWidth, resizeHandle } = useResizable({
    initialWidth: 240,
    maxWidth: 400,
    minWidth: 180,
  })

  return (
    <>
      <div
        className="side-nav flex w-[240px] shrink-0 overflow-hidden border-r bg-[#171717] z-[1] transition-transform duration-200 border-t"
        style={{ width: resizedWidth }}
      >
        <Projects
          isFullScreen={isFullScreen}
          platform={platform}
        />
        <Histories
          isFullScreen={isFullScreen}
          platform={platform}
        />

        <div
          className="w-px h-screen absolute right-0 bg-secondary cursor-ew-resize"
          {...resizeHandle}
        ></div>
      </div>

      <SideNavToggler />
    </>
  )
}

export default SideBar
