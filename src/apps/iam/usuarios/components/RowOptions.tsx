import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { User, UserService } from "../services"
import { UsuarioPolicy } from "../policies"

type Props = {
  user: User
}
export const RowOptions = ({user}: Props) => {

  const modal = useModal<{
    state: "loading" | "error"
    error?: Error
  }>("queryLoader")

  const queryClient = useQueryClient()

  const cambiarEstado = useMutation(()=>{
    return user.estado ? UserService.bloquear(user.id) : UserService.desbloquear(user.id)
  }, {
    onSuccess: ()=>{
      modal.close()
      queryClient.setQueryData("usuarios.buscar", (oldData: any) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            records: oldData.data.records.map((u: any)=>{
              return u == user ? {
                ...u,
                estado: !user.estado
              } : {...u}
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
        error: cambiarEstado.error as any
      })
    }
  }, [cambiarEstado.status])

  return <Dropdown style={{position: "initial"}}>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-users-${user.id}`}
    />
    <Dropdown.Menu>
      <ProtectedContent
        authorize={UsuarioPolicy.view}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/iam/usuarios/${user.id}`,
          state: {
            user
          }
        }} >Ver</Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={UsuarioPolicy.edit}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/iam/usuarios/${user.id}/editar`,
          state: { user }
        }}>Editar</Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={UsuarioPolicy.changePassword}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/iam/usuarios/${user.id}/cambiar-contrasena`,
          state: { user }
        }}>Cambiar contraseña</Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={(loggedUser)=>user.estado ? UsuarioPolicy.disable(loggedUser) : UsuarioPolicy.enable(loggedUser)}
      >
        <Dropdown.Item className="text-danger" onClick={()=>{
            cambiarEstado.mutate()
        }}>{user.estado ? "Bloquear" : "Desbloquear"}</Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>
}