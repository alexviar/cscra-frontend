import { useState } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FaSync } from "react-icons/fa"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useInfiniteQuery } from 'react-query'
import { Proveedor, Filter as ProveedorFilter, ProveedoresService } from "../services"
import 'react-bootstrap-typeahead/css/Typeahead.css'

export type { Proveedor }

type Props = {
  feedback?: string,
  filter?: ProveedorFilter
  defaultOptions?: Proveedor[]
} & Omit<AsyncTypeaheadProps<Proveedor>, "isLoading" | "options" | "onSearch">

export const ProveedoresTypeahead = ({isInvalid, feedback, filter={}, ...props}: Props) => {
  
  const [options, setOptions] = useState<Proveedor[]>(props.defaultOptions || [])
  const [ search, setSearch ] = useState("")

  filter = {
    ...filter,
    _busqueda: search
  }

  const queryKey = ["proveedores", "buscar", filter]

  const buscar = useInfiniteQuery(queryKey, ({pageParam = 1})=>{
    return ProveedoresService.buscar({
      current: pageParam,
      size: 10
    }, filter)
  }, {
    enabled: !!search,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.data.meta.nextPage,
    onSuccess: ({pages}) =>{
      setOptions(pages.flatMap((response)=>response.data.records, 1))
    }
  })

  return <InputGroup hasValidation  className="position-unset">
    <AsyncTypeahead
      clearButton
      align="left"
      emptyLabel={buscar.isError ? "" : "No se encontraron resultados"}
      promptText="Escribe un nombre o especialidad para buscar"
      searchText="Buscando..."
      paginationText="Cargar más..."
      {...props}
      labelKey={(proveedor: Proveedor) => proveedor.razonSocial!}
      className={props.className + ((buscar.isError || isInvalid) ? " is-invalid" : "")}
      isInvalid={buscar.isError || isInvalid}
      filterBy={()=>true}
      maxResults={10}
      minLength={0}
      options={options}
      isLoading={buscar.status == "loading" || buscar.isFetchingNextPage}
      onSearch={(search) => {
        setSearch(search)
      }}
      paginate
      onPaginate={()=>{
        buscar.fetchNextPage()
      }}
      useCache={false}

      renderMenuItemChildren={(proveedor) => {
        return <div>
          <div>{proveedor.razonSocial}</div>
          <small className="text-muted">{proveedor.tipo == 1 ? proveedor.especialidad : "Empresa"}</small> 
        </div>
      }}
    />
    {buscar.isError ? <InputGroup.Append>
      <Button variant="outline-danger" onClick={()=>buscar.refetch()}><FaSync /></Button>
    </InputGroup.Append> : null}
    <Form.Control.Feedback type="invalid">{buscar.isError ? "Ocurrio un error al realizar la busqueda" : feedback}</Form.Control.Feedback>
  </InputGroup>
}