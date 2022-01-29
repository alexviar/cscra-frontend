import React, { useEffect } from 'react'
import { Alert, Form, ListGroup, Spinner } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useQuery } from 'react-query'
import { RolService, Rol } from '../services'

type Props = {
  initialized?: boolean,
  isInvalid?: boolean,
  selected?: Rol[],
  onChange?: (roles: Rol[])=>void
}

export const RolesCheckList = React.memo(({
  initialized,
  isInvalid,
  selected=[],
  onChange
}: Props)=>{
  const buscar = useQuery(["roles", "buscar"], ()=>{
    return RolService.buscar()
  }, {
    refetchOnReconnect: false,
    // refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const roles = (buscar.data?.data || []) as Rol[]

  const renderContent = ()=>{
    // if(buscar.isFetching){
    //   return <><Spinner animation="border" size="sm" /><span>Cargando</span></>
    // }
    if(buscar.isError){
      return <Alert variant="danger">
        Ocurrio un error al obtener la lista de roles. Haga clic <a href="#"
          onClick={(e)=>{
            e.preventDefault()
            buscar.refetch()
          }}
        >aqui</a> para volver a intentar
      </Alert>
    }
    return <ListGroup as="ul" className={`overflow-auto flex-grow-1`} style={{maxHeight: "12rem"}}>
      {roles.map((rol, index)=>{
        return <ListGroup.Item key={rol.id} as="li"
          className={"py-2 px-3 text-capitalize" + (isInvalid ? " border-danger" : "")}
          action
        >
          <Form.Check type="checkbox"
            isInvalid={isInvalid}
            label={rol.name}
            checked={selected.some(rolChecked=>rolChecked.id == rol.id)}
            onChange={(e)=>{
              const isChecked = e.target.checked
              onChange && onChange(
                isChecked ? [...selected, rol] : selected.filter(rch=>rch.id != rol.id)
              )
            }}
          />
        </ListGroup.Item>
      })}
    </ListGroup>
  }

  return <div className={isInvalid ? "is-invalid" : ""} >
    {initialized && (buscar.isError || buscar.data?.data) ? renderContent() : <Skeleton height="12rem" />}
  </div>
})