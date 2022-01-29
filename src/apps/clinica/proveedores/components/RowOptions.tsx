import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
// import { FaEdit } from "react-icons/fa"
import { useMutation, useQueryClient, QueryKey } from "react-query"
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Proveedor, ProveedoresService } from "../services"
import { proveedorPolicy } from "../policies"

type Props = {
  proveedor: Proveedor
  queryKey: QueryKey
}
export const RowOptions = ({proveedor, queryKey}: Props) => {

  
  const modal = useModal<{
    state: "loading" | "error"
    error?: Error
  }>("queryLoader")

  const queryClient = useQueryClient()

  const actualizarEstado = useMutation((estado: 1 | 2)=>{
    return ProveedoresService.actualizarEstado(proveedor.id, estado)
  }, {
    onSuccess: ()=>{
      modal.close()
      queryClient.setQueryData(queryKey, (oldData: any) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            records: oldData.data.records.map((p: any)=>{
              return p.id == proveedor.id ? {
                ...p,
                estado: p.estado == 1 ? 2 : 1
              } : p
            })
          }
        }
      })
    }
  })

  useEffect(()=>{
    if(actualizarEstado.status == "loading"){
      modal.open({
        state: "loading"
      })
    }
    else if(actualizarEstado.status == "error"){
      modal.open({
        state: "error",
        error: actualizarEstado.error as any
      })
    }
  }, [actualizarEstado.status])

  return <Dropdown style={{position: "initial"}} alignRight>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-proveedores-${proveedor.id}`}
    />

    <Dropdown.Menu>
      <ProtectedContent
        authorize={(user)=>proveedorPolicy.view(user, {regionalId: proveedor.regionalId})}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/clinica/proveedores/${proveedor.id}`,
          state: {
            proveedor
          }
        }} ><span className="align-middle">Ver</span></Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={(user)=>proveedorPolicy.edit(user, {regionalId: proveedor.regionalId})}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/clinica/proveedores/${proveedor.id}/editar`,
          state: {
            proveedor
          }
        }} ><span className="align-middle">Editar</span></Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={(login) => proveedorPolicy.updateStatus(login, {regionalId: proveedor.regionalId})}
      >
        <Dropdown.Item className="text-danger" onClick={()=>{
            actualizarEstado.mutate(proveedor.estado == 1 ? 2 : 1)
        }}>
          {proveedor.estado == 1 ? "Baja" : "Habilitar"}
        </Dropdown.Item>
      </ProtectedContent>

    </Dropdown.Menu>
  </Dropdown>
}