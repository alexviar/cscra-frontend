import { AxiosError } from "axios"
import React, { useRef, useState} from "react"
import { Button, Col, Dropdown, Form, Row, Spinner, Table } from "react-bootstrap"
import { Dm11Viewer, Dm11ViewerRef } from "./Dm11Viewer"
import { useMutation, useQuery } from "react-query"
import VerticalEllipsisDropdownToggle from "../../../../commons/components/VerticalEllipsisDropdownToggle"
import { Page } from "../../../../commons/services/Page"
import { SolicitudesAtencionExternaFilter, SolicitudesAtencionExternaService } from "../services/SolicitudesAtencionExternaService"
import { SolicitudAtencionExternaFilterForm } from "./SolicitudAtencionExternaFilterForm"
import Pagination from "../../../../commons/components/Pagination"
import {FaFilter, FaPlus, FaSync} from "react-icons/fa"
import { Link, useLocation } from "react-router-dom"

export const SolicitudAtencionExternaIndex = ()=>{
  const {pathname: path} = useLocation()
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const [filter, setFilter] = useState<SolicitudesAtencionExternaFilter>({})

  const dm11ViewerRef = useRef<Dm11ViewerRef>(null)

  const buscarSolicitudesAtencionExterna = useQuery(["buscarSolicitudesAtencionExterna", page, filter], ()=>{
    return SolicitudesAtencionExternaService.buscar(filter, page)
  }, {
    keepPreviousData: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess: ({data: {meta}}) => {
      setTotal(meta.total)
    }
  })

  const generarDm11 = useMutation((numeroSolicitud: number)=>{
    return SolicitudesAtencionExternaService.generarDm11(numeroSolicitud)
  }, {
    onSuccess: ({data: {url}}) => {
      dm11ViewerRef.current?.setUrl(url)
      dm11ViewerRef.current?.show(true)
    }
  })

  const renderRows = ()=>{
    if (buscarSolicitudesAtencionExterna.isFetching) {
      return <tr>
        <td className="bg-light text-center" colSpan={100}>
          <Spinner className="mr-2" variant="primary" animation="border" size="sm" />
          Cargando
        </td>
      </tr>
    }
    if (buscarSolicitudesAtencionExterna.isError) {
      const { error } = buscarSolicitudesAtencionExterna
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {(error as AxiosError).response?.data?.message || (error as AxiosError).message}
        </td>
      </tr>
    }
    const records = buscarSolicitudesAtencionExterna.data!.data.records
    if(records.length == 0){
      return  <tr>
        <td className="bg-light text-center" colSpan={100}>
          No se encontraron resultados
        </td>
    </tr>
    }
    return records.map((solicitud, index)=>{
      return <tr key={solicitud.id}>
        <td>{index + 1}</td>
        <td>{solicitud.numero}</td>
        <td>{solicitud.fecha}</td>
        <td>{solicitud.matricula_asegurado}</td>
        <td>{solicitud.doctor}</td>
        <td>{solicitud.proveedor}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
              variant="link" id={`dropdown-solicitud-${solicitud.id}`}
            />
              <Dropdown.Menu>
              {
              !!solicitud.url_dm11 ?
                <Dropdown.Item href="#" onClick={() => {
                  dm11ViewerRef.current?.setUrl(solicitud.url_dm11)
                  dm11ViewerRef.current?.show(true)
                }}>Ver D.M. - 11</Dropdown.Item> :
                <Dropdown.Item href="#" onClick={() => {
                  generarDm11.mutate(solicitud.numero)
                }}>Generar D.M. - 11</Dropdown.Item>
              }
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    })
  }

  return <div className="px-1">
    <h1 style={{fontSize: "1.75rem"}}>Solicitudes de atención externa</h1>
    <div className="d-flex my-2">
      <Row className="ml-auto flex-nowrap" >
        <Col className={"pr-0"} xs="auto" >
          <Button onClick={()=>{
            // refetch()
          }}><FaSync /></Button>
        </Col>
        <Col className={"pr-0"} xs="auto" >
          <Button onClick={()=>{
            // showUsersFilter(visible=>!visible)
          }}><FaFilter /></Button>
        </Col>
        <Col xs="auto">
          <Button
            as={Link}
            to={`${path}/registrar`}
            className="d-flex align-items-center">
              <FaPlus className="mr-2" />Nuevo
          </Button>
        </Col>
      </Row>
    </div>
    <Row>
      <Col className="mb-2">
        <SolicitudAtencionExternaFilterForm onFilter={(filter)=>{
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
          <th>Nº</th>
          <th>Fecha y hora</th>
          <th>Matrícula asegurado</th>
          <th>Doctor</th>
          <th>Proveedor</th>
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
        minimum={Math.max(1, page.current - 4)}
        maximum={Math.min(Math.trunc((total - page.size) / page.size) + 1, page.current + 4)}
        total={((total - page.size) / page.size) + 1}
        onClickFirst={() => setPage((page) => ({ ...page, current: 1 }))}
        onClickPrev={() => setPage((page) => ({ ...page, current: page.current - 1 }))}
        onClickItem={(current) => setPage((page) => ({ ...page, current: page.current }))}
        onClickNext={() => setPage(page => ({ ...page, current: page.current + 1 }))}
        onClickLast={() => setPage(page => ({ ...page, current: ((total - page.size) / page.size) + 1 }))}
      />
    </div>
    <Dm11Viewer ref={dm11ViewerRef} />
  </div>
}