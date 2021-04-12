import { forwardRef, useState, useImperativeHandle } from "react";
import { Modal, ModalProps } from "react-bootstrap";

// We need to wrap component in `forwardRef` in order to gain
// access to the ref object that is assigned using the `ref` prop.
// This ref is passed as the second parameter to the function component.
export type ImperativeModalRef = {
  show: (show: boolean) => void
}

export const ImperativeModal = forwardRef<ImperativeModalRef, ModalProps>((props, ref) => {
  const [visible, show] = useState(false)

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    show
  }), []);

  return <Modal centered {...props} show={visible} onHide={()=>show(false)} />;
});