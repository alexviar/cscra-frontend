import { Dropdown } from "react-bootstrap"
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { solicitudAtencionExternaPolicy } from "../policies"
import { SolicitudAtencionExterna } from "../services"

type Props = {
  solicitud: SolicitudAtencionExterna
}
export const RowOptions = ({solicitud}: Props) => {

  const modal = useModal("pdfModal")

  return <Dropdown style={{position: "initial"}}>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-solicitud-${solicitud.id}`}
    />
    <Dropdown.Menu alignRight>
      <ProtectedContent
        authorize={(user) => solicitudAtencionExternaPolicy.emit(user, solicitud)}
      >
        <Dropdown.Item href="#" onClick={() => {
          modal.open({
            title: "Formulario D.M. - 11",
            url: solicitud.urlDm11
          })
        }}>Ver D.M. - 11</Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>
}