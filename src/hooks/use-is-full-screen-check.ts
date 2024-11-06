import { useEffect, useState } from 'react';

function useIsFullScreenCheck() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const checkWindowState = () => {
      window.ipcRenderer.send('window:getState');
    };

    const handleWindowState = (_event: Event, isFullScreen: boolean) => {
      setIsFullScreen(isFullScreen);
    };

    checkWindowState();

    // @ts-ignore
    window.ipcRenderer.on('window:state', handleWindowState);

    // Debounce resize event for performance optimization
    const debounce = (func: () => void, delay: number) => {
      let timer: ReturnType<typeof setTimeout>;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => func(), delay);
      };
    };

    const debouncedCheckWindowState = debounce(checkWindowState, 200);
    window.addEventListener('resize', debouncedCheckWindowState);

    return () => {
      // @ts-ignore
      window.ipcRenderer.off('window:state', handleWindowState);
      window.removeEventListener('resize', debouncedCheckWindowState);
    };
  }, []);

  return isFullScreen;
}

export default useIsFullScreenCheck;
