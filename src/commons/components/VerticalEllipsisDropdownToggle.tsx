import React, { ForwardedRef } from "react"
import { Button, ButtonProps } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";

export const VerticalEllipsisDropdownToggle = React.forwardRef<ForwardedRef<HTMLButtonElement>, ButtonProps>(({children, className, ...props}, ref) => (
  <Button
    className="py-0 px-1"
    {...props}
    ref={ref}
  >
    <FaEllipsisV />
  </Button>
));

export default VerticalEllipsisDropdownToggle