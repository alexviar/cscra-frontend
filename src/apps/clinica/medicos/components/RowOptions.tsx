import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
// import { FaEdit } from "react-icons/fa"
import { QueryKey, useMutation, useQueryClient } from "react-query"
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Medico, MedicosService } from "../services"
import { MedicoPolicy } from "../policies"

type Props = {
  medico: Medico,
  queryKey: QueryKey
}
export const RowOptions = ({medico, queryKey}: Props) => {

  const modal = useModal<{
    state: "loading" | "error"
    error?: Error
  }>("queryLoader")

  const queryClient = useQueryClient()

  const cambiarEstado = useMutation(()=>{
    return MedicosService.cambiarEstado(medico.id, medico.estado == 1 ? 2 : 1)
  }, {
    onSuccess: ()=>{
      modal.close()
      queryClient.invalidateQueries("medicos.buscar", { inactive: true })
      queryClient.setQueryData(queryKey, (oldData: any) => {
        console.log(oldData)
        return {
          ...oldData,
          data: {
            ...oldData.data,
            records: oldData.data.records.map((i: any)=>{
              return i == medico ? {
                ...i,
                estado: medico.estado == 1 ? 2 : 1,
                estadoText: medico.estado == 1 ? "Baja" : "Alta"
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

  return <Dropdown>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-medicos-${medico.id}`}
    />
    
    <Dropdown.Menu>
      <ProtectedContent
        authorize={MedicoPolicy.edit}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/clinica/medicos/${medico.id}/editar`,
          state: {
            medico
          }
        }} ><span className="align-middle">Editar</span></Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={MedicoPolicy.baja}
      >
        <Dropdown.Item className="text-danger" href="#" onClick={() => {
          if (window.confirm("¿Está seguro?")) {
            cambiarEstado.mutate()
          }
        }}>{medico.estado == 1 ? "Baja" : "Alta"}</Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>  
}