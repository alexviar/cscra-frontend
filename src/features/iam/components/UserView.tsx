import React, {useEffect, useState} from 'react'
import { Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { useQuery } from 'react-query'
import { User } from '../../auth/state'
import { Users } from '../services'

export const UserView = ()=>{
  const {state} = useLocation<{user?: User}>()
  const {userId} = useParams<{
    userId: string
  }>()
  const [user, setUser] = useState(state?.user)
  const fetchUser = useQuery(["fetchUser", userId], ()=>{
    return Users.load(parseInt(userId))
  }, {
    enabled: !state?.user,
    refetchOnWindowFocus: false
  })

  useEffect(()=>{
    if(fetchUser.data){
      setUser(fetchUser.data?.data)
    }
  }, [fetchUser.data])

  return <>
    <h2 style={{fontSize: "1.75rem"}}>{user?.username}</h2>
    <Table>
      <tbody>
        <tr>
          <th className="text-nowrap" scope="row" style={{width: '1px'}}>Nombre de usuario</th>
          <td>: {user?.username}</td>
        </tr>
        <tr>
          <th scope="row">Estado</th>
          <td>: {user?.active ? 'Activo' : 'Inactivo'}</td>
        </tr>
        <tr>
          <th scope="row">Creado en</th>
          <td>: {user?.createdAt}</td>
        </tr>
        <tr>
          <th scope="row">Actualizado en</th>
          <td>: {user?.updatedAt}</td>
        </tr>
        <tr>
          <th scope="row">Roles</th>
          <td>: {user?.updatedAt}</td>
        </tr>
      </tbody>
    </Table>
  </>
}