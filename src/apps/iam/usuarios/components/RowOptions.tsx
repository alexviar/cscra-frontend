import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query"
import { Link } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { User, UserService } from "../services"
import { usuarioPolicy } from "../policies"

type Props = {
  queryKey: QueryKey
  user: User
}
export const RowOptions = ({user, queryKey}: Props) => {

  const modal = useModal<{
    state: "loading" | "error"
    error?: Error
  }>("queryLoader")

  const queryClient = useQueryClient()

  const cambiarEstado = useMutation(()=>{
    return user.estado == 1 ? UserService.bloquear(user.id) : UserService.desbloquear(user.id)
  }, {
    onSuccess: ()=>{
      modal.close()
      queryClient.setQueryData(queryKey, (oldData: any) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            records: oldData.data.records.map((u: any)=>{
              return u == user ? {
                ...u,
                estado: user.estado == 1 ? 2 : 1
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
        authorize={(login) => usuarioPolicy.view(login, {regionalId: user.regionalId})}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/iam/usuarios/${user.id}`,
          state: {
            user
          }
        }} >Ver</Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={(login) => usuarioPolicy.edit(login, {regionalId: user.regionalId})}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/iam/usuarios/${user.id}/editar`,
          state: { user }
        }}>Editar</Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={(login) => usuarioPolicy.changePassword(login, {regionalId: user.regionalId})}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/iam/usuarios/${user.id}/cambiar-contrasena`,
          state: { user }
        }}>Cambiar contraseña</Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={(login)=> (user.estado == 1 ? usuarioPolicy.disable : usuarioPolicy.enable)(login, {regionalId: user.regionalId})}
      >
        <Dropdown.Item className="text-danger" onClick={()=>{
            cambiarEstado.mutate()
        }}>{user.estado == 1 ? "Bloquear" : "Habilitar"}</Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>
}