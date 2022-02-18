import React, { SyntheticEvent, useEffect, useState } from 'react'

type ScrollPosition = [number, number];

const useScroll = (ref: React.MutableRefObject<any>): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>([0,0]);

  useEffect(() => {
    if (!ref || !ref.current) {
      console.log('fail')
      return
    }
    ref.current.addEventListener('scroll', (e: SyntheticEvent<HTMLElement>) => {
      const { scrollLeft, scrollTop } = e.currentTarget;
      setScrollPosition([scrollLeft, scrollTop])
    })
  }, [ref])

  return scrollPosition
}

export { useScroll }
