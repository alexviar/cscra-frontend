import React, { useState} from "react"
import { Button, Col, Collapse, Form, InputGroup, Table } from "react-bootstrap"
import {FaFilter, FaSearch, FaSync} from "react-icons/fa"
import { Pagination } from "./Pagination"
import { Page } from "../services/Page"
import { User, ProtectedContent } from "../auth"
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from "constants"

type Props<Data> = {
  page: Page
  total: number
  data?: Data[]
  isLoading: boolean,
  hasError: boolean,
  policy: {
    view(user: User): boolean | undefined
    register(user: User): boolean | undefined
  }
  renderLoader: () => React.ReactElement
  renderData: (item: Data, index: number) => React.ReactElement
  renderDataHeaders: () => React.ReactElement
  renderFilterForm?: () => React.ReactElement
  renderCreateButton: () => React.ReactElement
  onRefetch: () => void
  onPageChange: (page: Page) => void
  onSearch?: (search: string) => void
}

export function IndexTemplate<Data>({
  total,
  page,
  data,
  isLoading,
  hasError,
  policy,
  onSearch,
  onRefetch,
  onPageChange,
  renderLoader,
  renderData,
  renderDataHeaders,
  renderCreateButton,
  renderFilterForm
}: Props<Data>) {
  
  const [ search, setSearch ] = useState("")
  const [ showFilterForm, setShowFilterForm] = useState(false)

  const renderRows = ()=>{
    if(data){
      if(data.length === 0){
        return  <tr>
          <td className="bg-light text-center" colSpan={100}>
            No se encontraron resultados
          </td>
      </tr>
      }
      return data.map(renderData)
    }
    if (isLoading) {
      return renderLoader()
    }
    if (hasError) {
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          Ocurrió un error al realizar la solicitud
        </td>
      </tr>
    }
    return null
  }

  return <div>
    <div className="d-flex my-2">
      <Form.Row className="ml-auto flex-nowrap" >
        <ProtectedContent
          authorize={policy.view}
        >
          <Col xs="auto" >
            <Button onClick={()=>{
              onRefetch()
            }}><FaSync /></Button>
          </Col>
          {renderFilterForm ? <Col xs="auto" >
            <Button onClick={()=>{
              setShowFilterForm(visible=>!visible)
            }}><FaFilter /></Button>
          </Col> : null}
        </ProtectedContent>
        <ProtectedContent
          authorize={policy.register}
        >
          <Col xs="auto">
            {renderCreateButton()}
          </Col>
        </ProtectedContent>
      </Form.Row>
    </div>
    <ProtectedContent
      authorize={policy.view}
    >
      {renderFilterForm ? <Collapse in={showFilterForm}>
        <div className="mb-2">
          {renderFilterForm()}
        </div>
      </Collapse> : null}
      <Form.Row className="mb-2">
        {onSearch ? <Col className="mb-2">
          {/* <Form.Row className="flex-nowrap">
            <Col>
              <Form.Control aria-label="Busqueda" type="search" />
            </Col>
            <Col xs={"auto"}>
              <Button className="ml-2" type="submit"><FaSearch /></Button>
            </Col>
          </Form.Row> */}
          <InputGroup>
              <Form.Control aria-label="Busqueda" type="search" value={search} onChange={(e)=>{
                setSearch(e.target.value)
              }} />
              <InputGroup.Append>
                <Button onClick={()=>{
                  onSearch(search)
                }}><FaSearch /></Button>
              </InputGroup.Append>
          </InputGroup>
        </Col> : null}
        <Col className="ml-auto" xs={"auto"}>
          <div className="d-flex flex-row flex-nowrap align-items-center">
            <span>Mostrar</span>
            <Form.Label htmlFor="pageSizeSelector" srOnly>Tamaño de pagina</Form.Label>
            <Form.Control id="pageSizeSelector" className="mx-2" as="select" value={page.size} onChange={(e) => {
              const value = e.target.value
              onPageChange({
                current: 1,
                size: parseInt(value)
              })
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
      </Form.Row>
      <Table responsive>
        <thead>
          {renderDataHeaders()}
        </thead>
        <tbody className="text-uppercase">
          {renderRows()}
        </tbody>
      </Table>
      <Form.Row>
        <Col className="mr-auto" xs="auto">
          {total > 0 ? <span style={{whiteSpace: "nowrap"}}>Se encontraron {total} resultados</span> : ""}
        </Col>
        <Col className="ml-auto" xs="auto">
          <Pagination
            current={page.current}
            total={Math.ceil(total / page.size)}
            onChange={(current) => onPageChange({ ...page, current })}
          />
        </Col>
      </Form.Row>
    </ProtectedContent>
  </div>
}