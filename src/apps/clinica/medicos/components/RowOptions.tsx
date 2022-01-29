import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
import { QueryKey, useMutation, useQueryClient } from "react-query"
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Medico, MedicosService } from "../services"
import { medicoPolicy } from "../policies"

type Props = {
  medico: Medico,
  queryKey: QueryKey
}
export const RowOptions = ({medico, queryKey}: Props) => {

  const modal = useModal("queryLoader")

  const queryClient = useQueryClient()

  const cambiarEstado = useMutation(()=>{
    return MedicosService.cambiarEstado(medico.id, medico.estado == 1 ? 2 : 1)
  }, {
    onSuccess: ()=>{
      modal.close()
      queryClient.invalidateQueries("medicos.buscar", { inactive: true })
      queryClient.setQueryData(queryKey, (oldData: any) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            records: oldData.data.records.map((i: any)=>{
              return i == medico ? {
                ...i,
                estado: medico.estado == 1 ? 2 : 1,
                estadoText: medico.estado == 1 ? "De baja" : "Activo"
              } : i
            })
          }
        }
      })
    }
  })

  useEffect(()=>{
    if(cambiarEstado.status == "loading"){
      modal.open({
        state: "loading"
      })
    }
    else if(cambiarEstado.status == "error"){
      modal.open({
        state: "error",
        error: cambiarEstado.error
      })
    }
  }, [cambiarEstado.status])

  return <Dropdown style={{position: "initial"}}>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-medicos-${medico.id}`}
    />
    
    <Dropdown.Menu>
      <ProtectedContent
        authorize={(user) => medicoPolicy.view(user, {regionalId: medico.regionalId})}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/clinica/medicos/${medico.id}`,
          state: {
            medico
          }
        }} ><span className="align-middle">Ver</span></Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={(user)=>medicoPolicy.edit(user, {regionalId: medico.regionalId})}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/clinica/medicos/${medico.id}/editar`,
          state: {
            medico
          }
        }} ><span className="align-middle">Editar</span></Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={(user)=>medicoPolicy.updateStatus(user, {regionalId: medico.regionalId})}
      >
        <Dropdown.Item className="text-danger" href="#" onClick={() => {
          // if (window.confirm("¿Está seguro?")) {
            cambiarEstado.mutate()
          // }
        }}>{medico.estado == 1 ? "Baja" : "Alta"}</Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>  
}