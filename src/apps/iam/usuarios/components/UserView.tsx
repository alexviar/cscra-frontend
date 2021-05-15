import React, {useEffect, useState} from 'react'
import { Button, Col, Form, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { UserService, User } from '../services'

export const UserView = ()=>{
  const {state} = useLocation<{user?: User}>()
  const {id} = useParams<{
    id: string
  }>()

  const cargar = useQuery(["cargarUsuario", id], ()=>{
    return UserService.cargar(parseInt(id))
  }, {
    enabled: !state?.user,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const user = state?.user || cargar.data?.data 

  return <>
    <h2 style={{fontSize: "1.75rem"}}>{user?.username}</h2>
    <Table>
      <tbody>
        <tr>
          <th scope="row">Carnet de identidad</th>
          <td>: {user?.ci}</td>
        </tr>
        <tr>
          <th scope="row">Nombre completo</th>
          <td>: {user?.nombreCompleto}</td>
        </tr>
        <tr>
          <th className="text-nowrap" scope="row" style={{width: '1px'}}>Nombre de usuario</th>
          <td>: {user?.username}</td>
        </tr>
        <tr>
          <th scope="row">Estado</th>
          <td>: {user?.estado ? 'Activo' : user?.estado === false ? 'Bloqueado' : ''}</td>
        </tr>
        <tr>
          <th scope="row">Creado el</th>
          <td>: {user?.createdAt}</td>
        </tr>
        <tr>
          <th scope="row">Actualizado el</th>
          <td>: {user?.updatedAt}</td>
        </tr>
        <tr>
          <th scope="row">Roles</th>
          <td className="text-capitalize">: {user?.roleNames}</td>
        </tr>
      </tbody>
    </Table>
    {user ? <Form.Row>
      <Col xs="auto">
        <Button as={Link} to={{
          pathname: `/iam/usuarios/${user.id}/editar`,
          state: {
            user
          }
        }} >Editar</Button>
      </Col>
      <Col xs="auto">
        <Button variant="danger">Bloquear</Button>
      </Col>
    </Form.Row> : null}
  </>
}