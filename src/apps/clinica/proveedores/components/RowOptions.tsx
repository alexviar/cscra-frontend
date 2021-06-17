import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
// import { FaEdit } from "react-icons/fa"
import { useMutation, useQueryClient, QueryKey } from "react-query"
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Proveedor, ProveedoresService } from "../services"
import { ProveedorPolicy } from "../policies"

type Props = {
  proveedor: Proveedor
  queryKey: QueryKey
}
export const RowOptions = ({proveedor}: Props) => {

  return <Dropdown style={{position: "initial"}}>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-proveedores-${proveedor.id}`}
    />

    <Dropdown.Menu>
      <ProtectedContent
        authorize={ProveedorPolicy.view}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/clinica/proveedores/${proveedor.id}`,
          state: {
            proveedor
          }
        }} ><span className="align-middle">Ver</span></Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={ProveedorPolicy.edit}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/clinica/proveedores/${proveedor.id}/editar`,
          state: {
            proveedor
          }
        }} ><span className="align-middle">Editar</span></Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>
}