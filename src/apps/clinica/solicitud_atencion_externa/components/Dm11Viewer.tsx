import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { Modal, ModalProps } from "react-bootstrap"
import { PDFViewer } from "../../../../commons/components"
import { ImperativeModal, ImperativeModalRef } from "../../../../commons/components/ImperativeModal"

export type State = {
  url?: string
}

export type Dm11ViewerRef = ImperativeModalRef & {
  setUrl: (url: string) => void
}

type Props = {
  modalRef: Dm11ViewerRef
}


export const Dm11Viewer = forwardRef<Dm11ViewerRef, ModalProps>((props, ref) => {
  const [url, setUrl] = useState("")
  const imperativeModalRef = useRef<ImperativeModalRef>(null)
  // const [visible, show] = useState(false)

  useImperativeHandle(ref, ()=>({
    show: (visible: boolean)=>imperativeModalRef.current?.show(visible),
    setUrl
  }), [])
  return <ImperativeModal {...props} ref={imperativeModalRef}>
    <Modal.Header>
      D.M. - 11
    </Modal.Header>
    <Modal.Body>
      {url ? <PDFViewer url={url}/> : null}
    </Modal.Body>
    <Modal.Footer>

    </Modal.Footer>
  </ImperativeModal>
})