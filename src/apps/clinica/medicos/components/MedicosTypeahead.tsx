
import { useEffect, useMemo, useState } from "react"
import { AxiosPromise, AxiosError } from "axios"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FaSync } from "react-icons/fa"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useInfiniteQuery } from 'react-query'
import { Medico, MedicoFilter, MedicosService } from "../services"
import { isMatch } from "../../../../commons/utils"
import 'react-bootstrap-typeahead/css/Typeahead.css'

export type { Medico }

type Props = {
  feedback?: string,
  filter?: MedicoFilter
  onLoad?: (options: Medico[])=>void
} & Omit<AsyncTypeaheadProps<Medico>, "isLoading" | "options" | "onSearch">

export const MedicosTypeahead = ({isInvalid, feedback, filter, filterBy, ...props}: Props) => {
  const [ search, setSearch ] = useState("")

  filter = {
    ...filter,
    nombre: search
  }

  const queryKey = ["medicos.buscar", filter]

  const buscar = useInfiniteQuery(queryKey, ({pageParam = 1})=>{
    return MedicosService.buscar({
      current: pageParam,
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
      labelKey={medico => medico.nombreCompleto!}
      className={(buscar.isError || isInvalid) ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      filterBy={(medico, props)=>{
        return (!props.text || isMatch(medico.nombreCompleto!, props) || isMatch(medico.especialidad, props))
          && (!filterBy || typeof filterBy === "function" && filterBy(medico, props))
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

      renderMenuItemChildren={(medico) => {
        return <div>
          <div>{medico.nombreCompleto}</div>
          <div className={"small text-muted"}>{medico.especialidad}</div> 
        </div>
      }}
    />
    {buscar.isError ? <InputGroup.Append>
      <Button variant="outline-danger" onClick={()=>buscar.refetch()}><FaSync /></Button>
    </InputGroup.Append> : null}
    <Form.Control.Feedback type="invalid">{(buscar.error as any)?.response?.message || (buscar.error as any)?.message ||feedback}</Form.Control.Feedback>
  </InputGroup>
}