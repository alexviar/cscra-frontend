import { AxiosError } from "axios"
import React, { useState } from "react"
import { Button, Col, Dropdown, Form, Row, Spinner, Table } from "react-bootstrap"
import { FaFilter, FaSync, FaUserPlus } from "react-icons/fa"
import { useMutation, useQuery } from "react-query"
import { Link } from "react-router-dom"
import Pagination from "../../../../commons/components/Pagination"
import VerticalEllipsisDropdownToggle from "../../../../commons/components/VerticalEllipsisDropdownToggle"
import { ListaMoraService, ListaMoraFilter as Filter } from "../services"
import ListaMoraFilter from "./ListaMoraFilter"

export default () => {
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState({
    current: 1,
    size: 10
  })
  const [filter, setFilter] = useState<Filter>({

  })
  const [filterFormVisible, showFilterForm] = useState(false)

  const fetchListaMora = useQuery(["fetchListaMora", page.current, page.size], () => {
    return ListaMoraService.fetch(page, filter)
  }, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: ({ data: { meta } }) => {
      setTotal(meta.total)
    }
  })

  const quitarEmpleadorEnMora = useMutation((empleadorId: number) => {
    return ListaMoraService.quitar(empleadorId)
  }, {
    onSuccess: () => {
      fetchListaMora.refetch()
    }
  })

  const renderRows = () => {
    if (fetchListaMora.isFetching) {
      return <tr>
        <td className="bg-light text-center" colSpan={100}>
          <Spinner className="mr-2" variant="primary" animation="border" size="sm" />
          Cargando
        </td>
      </tr>
    }
    else if (fetchListaMora.isError) {
      const { error } = fetchListaMora
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {(error as AxiosError).response?.data?.message || (error as AxiosError).message}
        </td>
      </tr>
    }
    const { data } = fetchListaMora
    const listaMora = data!.data.records
    return listaMora.map((item, index) => {
      return <tr key={item.id}>
        <td style={{ lineHeight: "26px" }}>
          {index + 1}
        </td>
        <td style={{ lineHeight: "26px" }}>
          {item.numeroPatronal}
        </td>
        <td style={{ lineHeight: "26px" }}>
          {item.nombre}
        </td>
        <td>
          <Dropdown>
            <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
              variant="link" id={`dropdown-${item.id}`}
            />

            <Dropdown.Menu>
              <Dropdown.Item className="text-danger" href="#" onClick={() => {
                if (window.confirm("¿Está seguro?")) {
                  quitarEmpleadorEnMora.mutate(item.empleadorId)
                }
              }}>Quitar</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    })
  }

  return <>
    <h1 style={{ fontSize: "2rem" }}>Empleadores en mora</h1>
    <div className="d-flex flex-nowrap">
      <Row className="mr-auto flex-nowrap">
        <Col className="d-flex flex-nowrap align-items-center">
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
        </Col>
      </Row>
      <Row className="ml-auto flex-nowrap" >
        <Col className={"pr-0"} xs="auto" >
          <Button className="my-2" onClick={() => {
            fetchListaMora.refetch()
          }}><FaSync /></Button>
        </Col>
        <Col className={"pr-0"} xs="auto" >
          <Button className="my-2" onClick={() => {
            showFilterForm(visible => !visible)
          }}><FaFilter /></Button>
        </Col>
        <Col xs="auto">
          <Button as={Link}
            to="/clinica/lista-mora/agregar"
            className="my-2">+Agregar</Button>
        </Col>
      </Row>
    </div>
    <ListaMoraFilter
      onApply={(filter) => {
        setFilter(filter)
      }}
    />
    <Table responsive className="text-nowrap">
      <thead>
        <tr>
          <th style={{ width: 1 }}>#</th>
          <th style={{ width: 1 }}>Nº Patronal</th>
          <th >Nombre</th>
          <th style={{ width: 1 }}></th>
        </tr>
      </thead>
      <tbody>
        {renderRows()}
      </tbody>
    </Table>
    <Row>
      <Col>
        <span>{`Se encontraron ${total} resultados`}</span>
      </Col>
      <Col>
        <Pagination
          current={page.current}
          minimum={Math.max(1, page.current - 4)}
          maximum={Math.min(Math.trunc((total - page.size) / page.size) + 1, page.current + 4)}
          total={((total - page.size) / page.size) + 1}
          onClickFirst={() => setPage((page) => ({ ...page, current: 1 }))}
          onClickPrev={() => setPage((page) => ({ ...page, current: page.current - 1 }))}
          onClickItem={(current) => setPage((page) => ({ ...page, current: page.current }))}
          onClickNext={() => setPage(page => ({ ...page, current: page.current + 1 }))}
          onClickLast={() => setPage(page => ({ ...page, current: ((total - page.size) / page.size) + 1 }))}
        />
      </Col>
    </Row>

  </>
}