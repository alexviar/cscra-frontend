import { useEffect } from 'react'
import { Alert, Form, ListGroup, Spinner } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { PermisoService, Permiso } from '../services'

type Props = {
  isInvalid?: boolean,
  selected?: Permiso[],
  onChange?: (permisos: Permiso[])=>void
}
export const PermisoCheckList = ({
  isInvalid,
  selected=[],
  onChange
}: Props)=>{
  const buscar = useQuery("permisos.buscar", ()=>{
    return PermisoService.buscar()
  }, {
    // refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const permisos = (buscar.data?.data || []) as Permiso[]

  const renderContent = ()=>{
    if(buscar.isFetching){
      return <><Spinner animation="border" size="sm" /><span>Cargando</span></>
    }
    if(buscar.isError){
      return <Alert variant="danger">
        Ocurrio un error al obtener la lista de permisos. Haga clic <a href="#"
          onClick={(e)=>{
            e.preventDefault()
            buscar.refetch()
          }}
        >aqui</a> para volver a intentar
      </Alert>
    }
    return <ListGroup as="ul" className={`overflow-auto flex-grow-1`} style={{maxHeight: "12rem"}}>
      {permisos.map((permiso, index)=>{
        return <ListGroup.Item key={permiso} as="li"
          className={"py-2 px-3 text-capitalize" + (isInvalid ? " border-danger" : "")}
          action
        >
          <Form.Check type="checkbox"
            isInvalid={isInvalid}
            label={permiso}
            checked={selected.some(s=>s == permiso)}
            onChange={(e)=>{
              const isChecked = e.target.checked
              onChange && onChange(
                isChecked ? [...selected, permiso] : selected.filter(s=>s != permiso)
              )
            }}
          />
        </ListGroup.Item>
      })}
    </ListGroup>
  }

  return <div className={isInvalid ? "is-invalid" : ""} >
    {renderContent()}
  </div>
}