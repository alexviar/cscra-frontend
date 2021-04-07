import React from 'react'
import { ListGroup } from 'react-bootstrap'
// import { Item, Menu, useContextMenu } from 'react-contexify'
import { Role } from '../state';
// import { getWages } from '../selectors/inputSelectors'

// const MENU_ID = "ROLES_MENU"
export const RolesList = ({roles}: {roles: Role[]})=>{

  return <>
    <ListGroup className="flex-grow-1"  variant="flush"
      // onContextMenu={(e: any)=>{
      //   show(e, {
      //     props: { id: null}
      //   })
      // }}
    >
      {roles.map(w=>{
        return <ListGroup.Item key={w.id} className="py-2 px-3 text-capitalize" href={`#${w.id}`} action 
          // onContextMenu={(e)=>{
          //   e.stopPropagation()
          //   show(e, {
          //     props: {
          //       id: w.id
          //     }
          //   })
          // }} 
        >
          {w.name}
        </ListGroup.Item>
      })}
    </ListGroup>
    {/* <Menu id={MENU_ID}>
      <Item hidden={({props})=>props.id} onClick={function({props}){
          // history.push(`${url}/crear`, {})
        }}>
        Crear
      </Item>
      <Item hidden={({props})=>!props.id} onClick={function({props}){
          // const id = props.id
          // history.push(`${url}/editar/${id}`, {})
        }}>
        Editar
      </Item>
      <Item hidden={({props})=>!props.id} onClick={function({props}){
        const id = props.id
        // if(confirm("¿Está seguro de eliminar? Esta accion es irreversible")){
          // dispatch({
          //   type: "DELETE_WAGE_TYPE",
          //   payload: id
          // })
        // }
      }}>
        Eliminar
      </Item>
    </Menu> */}
  </>
}