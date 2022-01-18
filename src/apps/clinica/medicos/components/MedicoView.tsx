import { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { Medico, MedicosService } from '../services'
import { useQuery, useMutation } from 'react-query'
import { useLocation, useParams } from 'react-router-dom'
import { useUser } from "../../../../commons/auth"
import { useModal } from "../../../../commons/reusable-modal"
import { MedicoPolicy } from "../policies"

export const MedicoView = ()=>{
  const { pathname, state: locationState } = useLocation<{
    medico?: Medico
  }>()
  
  const { id } = useParams<{
    id: string
  }>()

  const loggedUser = useUser()

  const loader = useModal("queryLoader")

  const cargar = useQuery(["cargar", id], ()=>{
    return MedicosService.load(parseInt(id))
  }, {
    enabled: !locationState?.medico,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: () => {
      loader.close()
    },
    onError: (error) => {
      loader.open({
        state: "error",
        error
      })
    }
  })

  const medico = cargar.data?.data || locationState?.medico

  useEffect(()=>{
    if(cargar.isFetching){
      loader.open({state: "loading"})
    }
  }, [cargar.isFetching])
  
  return <>
    <h2 style={{fontSize: "1.75rem"}}>Medico</h2>
      <Table>
        <tbody>
          <tr>
            <th style={{width: 1}}>Carnet de identidad</th>
            <td>: {medico?.ci.texto}</td>
          </tr>
          <tr>
            <th style={{width: 1}}>Nombre</th>
            <td>: {medico?.nombreCompleto}</td>
          </tr>
          <tr>
            <th style={{width: 1}}>Regional</th>
            <td>: {medico?.regional}</td>
          </tr>
          <tr>
            <th style={{width: 1}}>Especialidad</th>
            <td>: {medico?.especialidad}</td>
          </tr>
        </tbody>
      </Table>
  </>
}