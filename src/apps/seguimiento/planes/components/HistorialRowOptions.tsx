import { Dropdown } from "react-bootstrap"
import { VscFilePdf } from 'react-icons/vsc'
import { useParams } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from '../../../../commons/reusable-modal'
import { ProtectedContent } from "../../../../commons/auth/components"
import { Avance } from "../services"

type Props = {
  avance: Avance
}
export const HistorialRowOptions = ({avance}: Props) => {
  const params = useParams<{
    planId: string
    actividadId: string
  }>()
  const planId = parseInt(params.planId)
  const actividadId = parseInt(params.actividadId)

  const pdfModal = useModal("pdfModal")

  return <Dropdown style={{position: "initial"}}>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-historial-${avance.id}`}
    />
    <Dropdown.Menu>
      <ProtectedContent
        authorize={()=>true}
      >
        {/* <Dropdown.Item href={avance.informeUrl} download target="_self"><FaDownload className="mr-2" />Descargar informe</Dropdown.Item> */}
        <Dropdown.Item onClick={()=>{
          pdfModal.open({
            title: 'Informe',
            url: avance.informeUrl
          })
        }}><VscFilePdf className="mr-2" />Ver informe</Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>
}