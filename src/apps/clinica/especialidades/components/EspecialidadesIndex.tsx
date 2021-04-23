import { AxiosError } from "axios"
import React, {useState, useRef} from "react"
import { Dropdown, ButtonGroup, Button, Form, Table, Spinner, Row, Col } from "react-bootstrap"
import { useQuery } from "react-query"
import Pagination from "../../../../commons/components/Pagination"
import VerticalEllipsisDropdownToggle from "../../../../commons/components/VerticalEllipsisDropdownToggle"
import { Page } from "../../../../commons/services/Page"
import { EspecialidadesService } from "../services"
import { EspecialidadesFilter } from "./EspecialidadesFilter"
import { ImportarForm } from "./ImportarForm"

export const EspecialidadesIndex = ()=>{
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const [filter, setFilter] = useState("")

  const importModalRef = useRef<{show(visible: boolean): void}>()

  const buscarEspecialidades = useQuery(["buscarEspecialidades", page, filter], ()=>{
    return EspecialidadesService.buscar(filter, page)
  }, {
    keepPreviousData: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess: ({data: {meta}}) => {
      setTotal(meta.total)
    }
  })

  const renderRows = ()=>{
    if (buscarEspecialidades.isFetching) {
      return <tr>
        <td className="bg-light text-center" colSpan={100}>
          <Spinner className="mr-2" variant="primary" animation="border" size="sm" />
          Cargando
        </td>
      </tr>
    }
    if (buscarEspecialidades.isError) {
      const { error } = buscarEspecialidades
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {(error as AxiosError).response?.data?.message || (error as AxiosError).message}
        </td>
      </tr>
    }
    const records = buscarEspecialidades.data!.data.records
    if(records.length == 0){
      return  <tr>
        <td className="bg-light text-center" colSpan={100}>
          No se encontraron resultados
        </td>
    </tr>
    }
    return records.map((especialidad, index)=>{
      return <tr key={especialidad.id}>
        <td>{index + 1}</td>
        <td>{especialidad.nombre}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
              variant="link" id={`dropdown-especialidad-${especialidad.id}`}
            />

            <Dropdown.Menu>
              <Dropdown.Item className="text-danger" href="#" onClick={() => {
                if (window.confirm("¿Está seguro?")) {
                  // quitarEmpleadorEnMora.mutate(item.empleadorId)
                }
              }}>Eliminar</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    })
  }

  return <div className="px-1">
    <h2 style={{fontSize: "1.75rem"}}>Especialidades</h2>
    <div className="d-flex mb-2">
      <Dropdown className="ml-auto" as={ButtonGroup}>
        <Button>Nuevo</Button>
        <Dropdown.Toggle split id="especialidades-dropdown" />
        <Dropdown.Menu>
          <Dropdown.Item href="#" onClick={()=>{
            importModalRef.current && importModalRef.current.show(true)
          }}
          >Importar</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    <Row>
      <Col className="mb-2">
        <EspecialidadesFilter onSearch={(filter)=>{
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
    <ImportarForm modalRef={importModalRef} />
  </div>
}