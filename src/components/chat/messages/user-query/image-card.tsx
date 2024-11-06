import { useState, useEffect, useCallback } from 'react';
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import useContextStore from '../../../../store/context';

import { Button } from "../../../../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../../../components/ui/carousel";
import constants from '../../../../utils/constants';

type props = {
  images: string[]
}

function ImageCard({ images }: props) {
  const chat_id = useContextStore(s => s.chat_id)

  const [api, setApi] = useState<any>(null)
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const handlePrevious = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const handleNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  return (
    <div className="df justify-end mr-8 mb-3">
      {
        count > 1 &&
        <div className="df justify-center mt-auto space-x-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handlePrevious}
            className="size-8 p-0 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={current === 1}
          >
            <LuChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-white/80">
            {current} / {count}
          </span>

          <Button
            size="icon"
            variant="outline"
            onClick={handleNext}
            className="size-8 p-0 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={count === current}
          >
            <LuChevronRight className="h-4 w-4" />
          </Button>
        </div>
      }

      <Carousel setApi={setApi} className="w-80 border rounded-md">
        <CarouselContent>
          {
            images?.map(src => (
              <CarouselItem key={src}>
                <img
                  src={`${constants.backendUrl}/image/img_${chat_id}/${src}`}
                  className="w-full h-60 object-cover rounded-md"
                  alt=""
                />
              </CarouselItem>
            ))
          }
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default ImageCard
