import { AxiosError } from "axios"
import {useState, useRef} from "react"
import { Dropdown, ButtonGroup, Button, Form, Table, Spinner, Row, Col } from "react-bootstrap"
import { FaSync, FaEdit, FaTrash } from "react-icons/fa"
import { useQuery, useMutation } from "react-query"
import { Link } from "react-router-dom"
import { ImperativeModalRef } from "../../../../commons/components/ImperativeModal"
import { ImportModal } from "../../../../commons/components/ImportModal"
import Pagination from "../../../../commons/components/Pagination"
import VerticalEllipsisDropdownToggle from "../../../../commons/components/VerticalEllipsisDropdownToggle"
import { Page } from "../../../../commons/services/Page"
import { PrestacionesService } from "../services"
import { PrestacionesFilterForm } from "./PrestacionesFilterForm"
// import { EspecialidadesFilter } from "./EspecialidadesFilter"
// import { ImportarPrestaciones } from "./ImportarPrestaciones"

export const PrestacionesIndex = ()=>{
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const [filter, setFilter] = useState("")

  const importModalRef = useRef<ImperativeModalRef>(null)

  const buscarPrestaciones = useQuery(["buscarPrestaciones", page, filter], ()=>{
    return PrestacionesService.buscar(page, filter)
  }, {
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
    if (buscarPrestaciones.isFetching) {
      return <tr>
        <td className="bg-light text-center" colSpan={100}>
          <Spinner className="mr-2" variant="primary" animation="border" size="sm" />
          Cargando
        </td>
      </tr>
    }
    if (buscarPrestaciones.isError) {
      const { error } = buscarPrestaciones
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {(error as AxiosError).response?.data?.message || (error as AxiosError).message}
        </td>
      </tr>
    }
    const records = buscarPrestaciones.data!.data.records
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
                pathname: `/clinica/configuracion/prestaciones/${prestacion.id}/editar`,
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
    <h2 style={{fontSize: "1.75rem"}}>Servicios subrogados</h2>
    <Row className="mb-2">
      <Col className="ml-auto pr-0" xs="auto" >
        <Button onClick={()=>buscarPrestaciones.refetch()}><FaSync /></Button>
      </Col>
      <Col xs="auto">
        <Dropdown as={ButtonGroup}>
          <Button as={Link} replace to={"/clinica/configuracion/prestaciones/registrar"}>Nuevo</Button>
          <Dropdown.Toggle split id="especialidades-dropdown" />
          <Dropdown.Menu>
            <Dropdown.Item onClick={()=>{
              console.log(importModalRef)
              importModalRef.current && importModalRef.current.show(true)
            }}
            >Importar</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
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
    <ImportModal ref={importModalRef}
      import={(file, options)=>{
        return PrestacionesService.importar(file, options.separator, options.format)
      }}
    />
  </div>
}