
import { useEffect, useMemo } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { FaSync } from 'react-icons/fa'
import { useQuery } from 'react-query'
import { Provincia, UnidadesTerritorialesService } from "../services";
import { isMatch } from "../utils";
import 'react-bootstrap-typeahead/css/Typeahead.css';

export type { Provincia }

type Props = {
  feedback?: string,
  onLoad?: (options: Provincia[])=>void
} & Omit<TypeaheadProps<Provincia>, "isLoading" | "options" | "onSearch">

let count = 0
export const ProvinciasTypeahead = ({
  isInvalid,
  feedback,
  filterBy, ...props
}: Props) => {
  const queryKey = "provincias.buscar"

  const buscar = useQuery(queryKey, ()=>{
    return UnidadesTerritorialesService.getProvincias()
  }, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  useEffect(()=>{
    if(buscar.data){
      props.onLoad && props.onLoad(buscar.data?.data)
    }
  }, [buscar.data])

  const options = useMemo(()=>{
    if(Array.isArray(buscar.data?.data)){
        return buscar.data?.data!
    }
    else if(buscar.data?.data){
        console.error(buscar.data?.data)
    }
    return []
  }, [buscar.data?.data])

  return <InputGroup hasValidation>
    <Typeahead
      {...props}
      className={(buscar.isError || isInvalid) ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      filterBy={(provincia, props)=>{
        return (!props.text || isMatch(provincia.nombre, props)) 
          && (!filterBy || (typeof filterBy === "function" && filterBy(provincia, props)))
      }}
      isLoading={buscar.isFetching}
      options={options}
      labelKey="nombre"
    />
    {buscar.isError ? <>
      <InputGroup.Append>
        <Button variant="outline-danger" onClick={()=>buscar.refetch()}><FaSync /></Button>
      </InputGroup.Append>
      <Form.Control.Feedback type="invalid">{buscar.error?.response?.message || buscar.error?.message}</Form.Control.Feedback>
    </>
    : null}
    {feedback ? <Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback> : null}
    {/* {++count} */}
  </InputGroup>
}