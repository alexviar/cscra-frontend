import { FC, useRef, ComponentProps } from 'react'
import { useOnClickOutside } from './useOnClickOutside'

type Props = {
  onClickOutside: (event: MouseEvent | TouchEvent) => void
} & ComponentProps<"div">
export const ClickOutsideHandler:FC<Props> = ({children, onClickOutside, ...props}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, onClickOutside)
  return <div ref={containerRef} {...props}>
    {children}
  </div>
}