import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
import { useMutation, useQuery, useQueryClient, QueryKey } from "react-query"
import { FaEye, FaChartLine } from 'react-icons/fa'
import { Link, useParams, useLocation } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Actividad, PlanService } from "../services"
// import { RolPolicy } from "../policies"

type Props = {
  actividad: Actividad
}
export const ActividadRowOptions = ({actividad}: Props) => {
  const location = useLocation()
  const {planId} = useParams<{
    planId: string
  }>()

  return <Dropdown style={{position: "initial"}}>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-planes-${actividad.id}`}
    />
    <Dropdown.Menu>
      <ProtectedContent
        authorize={()=>true}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/seguimiento/planes/${planId}/actividades/${actividad.id}`,
          state: {
            actividad
          }
        }} ><FaEye className="mr-2" />Detalles</Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>
}