import { useEffect, useState } from "react"
import { Alert, Modal as BSModal, Spinner } from "react-bootstrap"
import { useSelector } from "react-redux"
import { PDFViewer } from "../../../../commons/components"

export const Dm11Viewer = ()=>{
  //@ts-ignore
  const modal = useSelector((state)=>state.modals.dm11Viewer)
  const [show, setShow] = useState(false)

  useEffect(()=>{
    setShow(modal.show)
  }, [modal.show])

  return <BSModal centered show={show} onHide={()=>{
    if(modal.state !== "loading") setShow(false)
  }}>
    <BSModal.Header>
      D.M. - 11
    </BSModal.Header>
    <BSModal.Body>
      {modal.url ? <PDFViewer url={modal.url}/> : null}
    </BSModal.Body>
  </BSModal>
}

// export const Dm11Viewer = forwardRef<Dm11ViewerRef, ModalProps>((props, ref) => {
//   const [url, setUrl] = useState("")
//   const imperativeModalRef = useRef<ImperativeModalRef>(null)
//   // const [visible, show] = useState(false)

//   useImperativeHandle(ref, ()=>({
//     show: (visible: boolean)=>imperativeModalRef.current?.show(visible),
//     setUrl
//   }), [])
//   return <ImperativeModal {...props} ref={imperativeModalRef}>
//     <Modal.Header>
//       D.M. - 11
//     </Modal.Header>
//     <Modal.Body>
//       {url ? <PDFViewer url={url}/> : null}
//     </Modal.Body>
//     <Modal.Footer>

//     </Modal.Footer>
//   </ImperativeModal>
// })