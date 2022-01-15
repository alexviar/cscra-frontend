
import { useEffect, useMemo, useState } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FaSync } from "react-icons/fa"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useInfiniteQuery } from 'react-query'
import { AxiosError } from 'axios'
import { Proveedor, Filter as ProveedorFilter, ProveedoresService } from "../services"
import { isMatch } from "../../../../commons/utils"
import 'react-bootstrap-typeahead/css/Typeahead.css'

export type { Proveedor }

type Props = {
  feedback?: string,
  filter?: ProveedorFilter
  onLoad?: (options: Proveedor[])=>void
} & Omit<AsyncTypeaheadProps<Proveedor>, "isLoading" | "options" | "onSearch">

export const ProveedoresTypeahead = ({isInvalid, feedback, filter={}, filterBy, ...props}: Props) => {
  const [ search, setSearch ] = useState("")

  filter = {
    ...filter,
    nombre: search
  }

  const queryKey = ["medicos.buscar", filter]

  const buscar = useInfiniteQuery(queryKey, ({pageParam = 1})=>{
    return ProveedoresService.buscar({
      current: pageParam as number,
      size: 10
    }, filter)
  }, {
    enabled: !!search,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    getNextPageParam: (lastPage) => lastPage.data.meta.nextPage,
  })

  // useEffect(()=>{
  //   if(buscar.data){
  //     props.onLoad && props.onLoad(buscar.data?.data)
  //   }
  // }, [buscar.data])
  
  const options = useMemo(()=>{
    if(buscar.data){
      return buscar.data?.pages.flatMap((response)=>response.data.records,1)
    }
    return []
  }, [buscar.data?.pages])

  return <InputGroup hasValidation>
    <AsyncTypeahead
      clearButton
      emptyLabel="No se encontraron resultados"
      align="left"
      {...props}
      disabled={!buscar.data}
      labelKey={(proveedor: Proveedor) => proveedor.tipo == 1 ? proveedor.nombre : proveedor.nombreCompleto!}
      className={(buscar.isError || isInvalid) ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      filterBy={(proveedor, props)=>{
        return  (!props.text || (proveedor.tipo == 1 ? isMatch(proveedor.nombre, props) : isMatch(proveedor.nombreCompleto, props)))
          && (!filterBy || (typeof filterBy === "function" && filterBy(proveedor, props)))
      }}

      maxResults={10}
      minLength={3}
      options={options}
      isLoading={buscar.isFetchingNextPage}
      onSearch={(search) => {
        setSearch(search)
      }}
      paginate={buscar.hasNextPage || !buscar.isFetchingNextPage}
      onPaginate={()=>{
        buscar.fetchNextPage()
      }}
      useCache={false}

      renderMenuItemChildren={(proveedor) => {
        return <div>
          <div>{proveedor.tipo == 1 ? proveedor.nombre : proveedor.nombreCompleto}</div>
          <div className="small muted">{proveedor.tipo == 2 ? proveedor.especialidad : "Empresa"}</div> 
        </div>
      }}
    />
    {buscar.isError ? <InputGroup.Append>
      <Button disabled={buscar.isFetching} 
        variant={buscar.isError ? "outline-danger" : "outline-secondary"}
        onClick={()=>buscar.refetch()}><FaSync />
      </Button>
    </InputGroup.Append> : null}
    <Form.Control.Feedback type="invalid">{
      (buscar.error as AxiosError)?.response?.data?.message || (buscar.error as AxiosError)?.message
      || feedback}</Form.Control.Feedback>
  </InputGroup>
}