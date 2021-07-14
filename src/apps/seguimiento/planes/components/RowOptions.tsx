import { Dropdown } from "react-bootstrap"
import { QueryKey } from "react-query"
import { FaEye } from 'react-icons/fa'
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Plan } from "../services"
import { PlanPolicy } from "../policies"

type Props = {
  plan: Plan
  queryKey: QueryKey
}
export const RowOptions = ({plan, queryKey}: Props) => {

  const modal = useModal("queryLoader")


  return <Dropdown style={{position: "initial"}}>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-planes-${plan.id}`}
    />
    <Dropdown.Menu>
      <ProtectedContent
        authorize={(user) => PlanPolicy.ver(user, plan)}
      >
        <Dropdown.Item as={Link} to={`/seguimiento/planes/${plan.id}`}><FaEye className="mr-2"/> Detalles</Dropdown.Item>
      </ProtectedContent>
      {/* <ProtectedContent
        authorize={()=>true}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/iam/roles/${rol.id}/editar`,
          state: {
            plan
          }
        }}>Editar</Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={()=>true}
      >
        <Dropdown.Item className="text-danger" onClick={()=>{
          if(window.confirm("Esta accion es irreversible, ¿Esta seguro de continuar?")){
            eliminar.mutate(rol.id)
          }
        }}>Eliminar</Dropdown.Item>
      </ProtectedContent> */}
    </Dropdown.Menu>
  </Dropdown>
}