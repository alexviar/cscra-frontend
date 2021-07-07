import { AxiosError } from "axios"
import {useState, useRef} from "react"
import { Dropdown, ButtonGroup, Button, Form, Table, Spinner, Row, Col } from "react-bootstrap"
import { FaSync, FaEdit, FaTrash } from "react-icons/fa"
import { useQuery, useMutation } from "react-query"
import { Link } from "react-router-dom"
import Pagination from "../../../../commons/components/Pagination"
import VerticalEllipsisDropdownToggle from "../../../../commons/components/VerticalEllipsisDropdownToggle"
import { Page } from "../../../../commons/services/Page"
import { PrestacionesService } from "../services"
import { PrestacionesFilterForm } from "./PrestacionesFilterForm"

export const PrestacionesIndex = ()=>{
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const [filter, setFilter] = useState("")

  const buscar = useQuery(["prestaciones.buscar", page, filter], ()=>{
    return PrestacionesService.buscar(page, filter)
  }, {
    // refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess: ({data: {meta}}) => {
      setTotal(meta.total)
    }
  })

  const eliminar = useMutation((id: number)=>{
    return PrestacionesService.eliminar(id)
  })

  const renderRows = ()=>{
    if (buscar.isFetching) {
      return <tr>
        <td className="bg-light text-center" colSpan={100}>
          <Spinner className="mr-2" variant="primary" animation="border" size="sm" />
          Cargando
        </td>
      </tr>
    }
    if (buscar.isError) {
      const { error } = buscar
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {(error as AxiosError).response?.data?.message || (error as AxiosError).message}
        </td>
      </tr>
    }
    const records = buscar.data!.data.records
    if(records.length == 0){
      return  <tr>
        <td className="bg-light text-center" colSpan={100}>
          No se encontraron resultados
        </td>
    </tr>
    }
    return records.map((prestacion, index)=>{
      return <tr key={prestacion.id}>
        <td>{index + 1}</td>
        <td>{prestacion.nombre}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
              variant="link" id={`dropdown-prestacion-${prestacion.id}`}
            />
            <Dropdown.Menu>
              <Dropdown.Item as={Link} replace to={{
                pathname: `/clinica/prestaciones/${prestacion.id}/editar`,
                state: {
                  prestacion
                }
              }} ><FaEdit /><span className="ml-2 align-middle">Editar</span></Dropdown.Item>
              <Dropdown.Item className="text-danger" href="#" onClick={() => {
                if (window.confirm("¿Está seguro?")) {
                  eliminar.mutate(prestacion.id)
                }
              }}><FaTrash /><span className="ml-2 align-middle">Eliminar</span></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    })
  }

  return <div className="px-1">
    <h2 style={{fontSize: "1.75rem"}}>Prestaciones</h2>
    <Form.Row className="mb-2">
      {/* <Col className="ml-auto pr-0" xs="auto" >
        <Button onClick={()=>buscar.refetch()}><FaSync /></Button>
      </Col> */}
      <Col className="ml-auto" xs="auto">
        {/* <Dropdown as={ButtonGroup}> */}
          <Button as={Link} replace to={"/clinica/prestaciones/registrar"}>Nuevo</Button>
          {/* <Dropdown.Toggle split id="especialidades-dropdown" />
          <Dropdown.Menu>
            <Dropdown.Item onClick={()=>{
              console.log(importModalRef)
              importModalRef.current && importModalRef.current.show(true)
            }}
            >Importar</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
      </Col>
    </Form.Row>
    <Row>
      <Col className="mb-2">
        <PrestacionesFilterForm onSearch={(filter)=>{
          setFilter(filter)
        }} />
      </Col>
      <Col className="mb-2" xs={"auto"}>
        <div className="d-flex flex-row flex-nowrap align-items-center">
            <span>Mostrar</span>
            <Form.Control className="mx-2" as="select" value={page.size} onChange={(e) => {
              const value = e.target.value
              setPage((page) => ({
                ...page,
                size: parseInt(value)
              }))
            }}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Form.Control>
            <span>filas</span>
        </div>
      </Col>
    </Row>
    <Table responsive>
      <thead>
        <tr>
          <th style={{width: 1}}>#</th>
          <th>Nombre</th>
          <th style={{width: 1}}></th>
        </tr>
      </thead>
      <tbody>
        {renderRows()}
      </tbody>
    </Table>
    <div className="d-flex flex-row">
      <span className="mr-auto">{`Se encontraron ${total} resultados`}</span>
      <Pagination
        current={page.current}
        total={Math.ceil((total - page.size) / page.size) + 1}
        onChange={(current) => setPage((page) => ({ ...page, current }))}
      />
    </div>
  </div>
}