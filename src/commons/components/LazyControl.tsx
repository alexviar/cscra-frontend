import { forwardRef } from 'react'
import { Form, FormControlProps } from 'react-bootstrap'
import { BsPrefixRefForwardingComponent } from 'react-bootstrap/helpers'
import Skeleton from 'react-loading-skeleton'

// const Wrapper = (props: any)=>{
//   return <span {...props} style={{fontSize: "1.5em"}} />
// }

export const LazyControl = forwardRef((
  { initialized, ...props }: any,
  ref
) => {
  return initialized ?
    <Form.Control ref={ref} {...props} /> :
    // props.as === "textarea" ? <Skeleton containerClassName="input-skeleton" count={props.rows || 2} /> : <Skeleton height="calc(1.5em + 0.75rem + 2px)" />
    <Skeleton containerClassName="input-skeleton" count={props.as === "textarea" ? props.rows || 2 : 1} />
}) as BsPrefixRefForwardingComponent<"input", {initialized: boolean} & FormControlProps>