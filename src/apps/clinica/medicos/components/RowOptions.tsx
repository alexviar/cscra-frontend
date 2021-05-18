import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
import { useMutation, useQueryClient } from "react-query"
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Medico, MedicosService } from "../services"
import { MedicoPolicy } from "../policies"

type Props = {
  medico: Medico
}
export const RowOptions = ({medico}: Props) => {

  const modal = useModal<{
    state: "loading" | "error"
    error?: Error
  }>("queryLoader")

  const queryClient = useQueryClient()

  const cambiarEstado = useMutation(()=>{
    return medico.estado == 1 ? MedicosService.baja(medico.id) : MedicosService.alta(medico.id)
  }, {
    onSuccess: ()=>{
      modal.close()
      queryClient.setQueryData("listaMora.buscar", (oldData: any) => {
        console.log(oldData)
        return {
          ...oldData,
          data: {
            ...oldData.data,
            records: oldData.data.records.map((i: any)=>{
              return i == medico ? {
                ...i,
                estado: 2
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
        authorize={MedicoPolicy.editar}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/clinica/medicos/${medico.id}/editar`,
          state: {
            medico: medico
          }
        }} ><FaEdit /><span className="ml-2 align-middle">Editar</span></Dropdown.Item>
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

{/* <Dropdown>
<Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
  variant="link" id={`dropdown-${medico.id}`}
/>

<Dropdown.Menu>
  <Dropdown.Item as={Link} to={{
    pathname: `/clinica/medicos/${medico.id}/editar`,
    state: {
      medico: medico
    }
  }} ><FaEdit /><span className="ml-2 align-middle">Editar</span></Dropdown.Item>
  <Dropdown.Item className="text-danger" href="#" onClick={() => {
    if (window.confirm("¿Está seguro?")) {
      eliminar.mutate(medico.id)
    }
  }}><FaTrash /><span className="ml-2 align-middle" >Eliminar</span></Dropdown.Item>
</Dropdown.Menu>
</Dropdown> */}
