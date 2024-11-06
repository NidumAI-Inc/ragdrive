import { useState, useCallback, useEffect } from 'react';

interface UseResizableOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

interface UseResizableReturn {
  resizedWidth: number;
  isResizing: boolean;
  startResizing: (e: React.MouseEvent) => void;
  stopResizing: () => void;
  resizeHandle: {
    onMouseDown: (e: React.MouseEvent) => void;
  };
}

const useResizable = ({
  initialWidth = 250,
  minWidth = 100,
  maxWidth = 500
}: UseResizableOptions = {}): UseResizableReturn => {
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [resizedWidth, setResizedWidth] = useState<number>(initialWidth)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      mouseMoveEvent.preventDefault();
      let newWidth = mouseMoveEvent.clientX

      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth))

      setResizedWidth(newWidth)

      if (newWidth <= minWidth) {
        document.body.classList.remove("open")
      } else {
        document.body.classList.add("open")
      }

      document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
    }
  }, [isResizing, maxWidth, minWidth])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      resize(e)
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      stopResizing()
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resize, stopResizing])

  useEffect(() => {
    if (isResizing) {
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'ew-resize'
    } else {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isResizing])

  return {
    resizedWidth,
    isResizing,
    startResizing,
    stopResizing,
    resizeHandle: {
      onMouseDown: startResizing
    }
  }
}

export default useResizable
