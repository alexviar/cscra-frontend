import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
import { useMutation, useQuery, useQueryClient, QueryKey } from "react-query"
import { FaEye } from 'react-icons/fa'
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Plan, PlanService } from "../services"
// import { RolPolicy } from "../policies"

type Props = {
  plan: Plan
  queryKey: QueryKey
}
export const RowOptions = ({plan, queryKey}: Props) => {

  const modal = useModal<{
    state: "loading" | "error"
    error?: Error
  }>("queryLoader")

  const queryClient = useQueryClient()

  // const eliminar = useMutation((id: number)=>{
  //   return RolService.eliminar(id)
  // }, {
  //   onSuccess: ()=>{
  //     modal.close()
  //     queryClient.invalidateQueries("roles.buscar",{inactive: true})
  //     queryClient.setQueryData(queryKey, (oldData: any) => {
  //       return {
  //         ...oldData,
  //         data: {
  //           ...oldData.data,
  //           records: oldData.data.records.filter((u: any)=>{
  //             return u !== rol
  //           })
  //         }
  //       }
  //     })
  //   }
  // })

  // useEffect(()=>{
  //   if(eliminar.status == "loading"){
  //     modal.open({
  //       state: "loading"
  //     })
  //   }
  //   else if(eliminar.status == "error"){
  //     modal.open({
  //       state: "error",
  //       error: eliminar.error
  //     })
  //   }
  // }, [eliminar.status])

  return <Dropdown style={{position: "initial"}}>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-planes-${plan.id}`}
    />
    <Dropdown.Menu>
      <ProtectedContent
        authorize={()=>true}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/seguimiento/planes/${plan.id}`,
          state: {
            plan
          }
        }} ><FaEye className="mr-2"/> Detalles</Dropdown.Item>
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