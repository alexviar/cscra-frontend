import { AxiosError } from "axios"
import React, { useState } from "react"
import { Button, Col, Dropdown, Form, Row, Spinner, Table } from "react-bootstrap"
import { FaEdit, FaTrash, FaFilter, FaSync, FaPlus } from "react-icons/fa"
import { useMutation, useQuery } from "react-query"
import { Link, useLocation } from "react-router-dom"
import Pagination from "../../../../commons/components/Pagination"
import VerticalEllipsisDropdownToggle from "../../../../commons/components/VerticalEllipsisDropdownToggle"
import { nombreCompleto } from "../../../../commons/utils/nombreCompleto"
import { MedicosService, Filter } from "../services"
import { MedicosFilterForm } from "./MedicosFilterForm"

export default () => {
  const {pathname: path} = useLocation()
  const [page, setPage] = useState({
    current: 1,
    size: 10
  })
  const [filter, setFilter] = useState<Filter>({

  })
  const [filterFormVisible, showFilterForm] = useState(false)

  const buscar = useQuery(["buscarMedicos", page.current, page.size], () => {
    return MedicosService.buscar(filter, page)
  }, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const total = buscar.data?.data?.meta?.total || 0

  const eliminar = useMutation((id: number) => {
    return MedicosService.eliminar(id)
  }, {
    onSuccess: () => {
      buscar.refetch()
    }
  })

  const renderRows = () => {
    if (buscar.isFetching) {
      return <tr>
        <td className="bg-light text-center" colSpan={100}>
          <Spinner className="mr-2" variant="primary" animation="border" size="sm" />
          Cargando
        </td>
      </tr>
    }
    else if (buscar.isError) {
      const error = buscar.error as AxiosError
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {error.response?.data?.message || error.message}
        </td>
      </tr>
    }
    const { data } = buscar
    const listaMora = data!.data.records
    return listaMora.map((item, index) => {
      return <tr key={item.id}>
        <th scope="row" style={{ lineHeight: "26px" }}>
          {index + 1}
        </th>
        <td style={{ lineHeight: "26px" }}>
          {/* {item.ci.raiz}-{item.ci.complemento} */}
          {item.ci.raiz}{item.ci.complemento ? `-${item.ci.complemento}` : ""}
        </td>
        <td style={{ lineHeight: "26px" }}>
          {nombreCompleto(item.apellidoPaterno, item.apellidoMaterno, item.nombres)}
        </td>
        <td style={{ lineHeight: "26px" }}>
          {item.especialidad}
        </td>
        <td>
          <Dropdown>
            <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
              variant="link" id={`dropdown-${item.id}`}
            />

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={{
                pathname: `/clinica/medicos/${item.id}/editar`,
                state: {
                  medico: item
                }
              }} ><FaEdit /><span className="ml-2 align-middle">Editar</span></Dropdown.Item>
              <Dropdown.Item className="text-danger" href="#" onClick={() => {
                if (window.confirm("¿Está seguro?")) {
                  eliminar.mutate(item.id)
                }
              }}><FaTrash /><span className="ml-2 align-middle" >Eliminar</span></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    })
  }

  
  return <div className="px-1">
    <h1 style={{fontSize: "1.75rem"}}>Medicos</h1>
    <div className="d-flex my-2">
      <Row className="ml-auto flex-nowrap" >
        <Col className={"pr-0"} xs="auto" >
          <Button onClick={()=>{
            buscar.refetch()
          }}><FaSync /></Button>
        </Col>
        <Col className={"pr-0"} xs="auto" >
          <Button onClick={()=>{
            showFilterForm(visible=>!visible)
          }}><FaFilter /></Button>
        </Col>
        <Col xs="auto">
          <Button
            as={Link}
            to={`${path}/registrar`}
            className="d-flex align-items-center">
              <FaPlus /><span className="mr-2">Nuevo</span>
          </Button>
        </Col>
      </Row>
    </div>
    <Row>
      <Col className="mb-2">
        <MedicosFilterForm onFilter={(filter)=>{
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
          <th>C.I.</th>
          <th>Nombre</th>
          <th>Especialidad</th>
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