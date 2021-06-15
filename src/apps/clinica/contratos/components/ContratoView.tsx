import { useEffect, useRef } from 'react'
import { AxiosError } from 'axios'
import { Table } from 'react-bootstrap'
import { useModal } from '../../../../commons/reusable-modal'
import { ContratosService, Contrato } from '../services'
import { useQuery, useMutation } from 'react-query'
import { Link, useLocation, useParams } from 'react-router-dom'


export const ContratoView = ()=>{
  const { idProveedor, id } = useParams<{
    idProveedor: string
    id: string
  }>()

  const loader = useModal("queryLoader")

  const cargar = useQuery(["contratos.cargar", idProveedor, id], ()=>{
    return ContratosService.cargar(parseInt(idProveedor), parseInt(id))
  }, {
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

  const contrato = cargar.data?.data

  useEffect(()=>{
    if(cargar.isFetching){
      loader.open({state: "loading"})
    }
  }, [cargar.isFetching])
  
  return <>
    <h2 style={{fontSize: "1.75rem"}}>Contrato</h2>
    
    <Table>
        <tbody>
          <tr>
            <th scope="row" style={{width:1}}>Inicio</th>
            <td>{(contrato?.inicio as any)}</td>
          </tr>
          <tr>
            <th scope="row" style={{width:1}}>Fin</th>
            <td>{(contrato?.fin as any) || contrato ? "Indefinido" : ""}</td>
          </tr>
          <tr>
            <th scope="row" style={{width:1}}>Extensión</th>
            <td>{(contrato?.extension as any) || contrato ? "Sin extensión" : ""}</td>
          </tr>
          <tr>
            <th scope="row" style={{width: 1}}>Estado</th>
            <td>{contrato?.estadoText}</td>
          </tr>
          <tr>
            <th scope="row" style={{width:1}}>Prestaciones</th>
            <td>
              <ul>
                {contrato?.prestaciones?.map((prestacion)=>{
                  return <li>{prestacion.nombre}</li>
                })}
              </ul>
            </td>
          </tr>
        </tbody>
      </Table>
    {/* {contrato ? <Form.Row>
      <Col xs="auto">
        <Button as={Link} to={{
          pathname: `/iam/contratoes/${contrato.id}/editar`,
          state: {
            contrato
          }
        }} >Editar</Button>
      </Col>
      <Col xs="auto">
        <Button variant="danger" onClick={()=>{
          modalRef.current?.show(true)
          eliminar.mutate()
        }}>
          {eliminar.isLoading ? <Spinner className="mr-2" animation="border" size="sm" /> : null}
          Eliminar
        </Button>
      </Col>
    </Form.Row> : null} */}
  </>
}