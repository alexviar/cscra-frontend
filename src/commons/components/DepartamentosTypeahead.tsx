
import { useEffect, useMemo } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { FaSync } from 'react-icons/fa'
import { useQuery } from 'react-query'
import { Departamento, UnidadesTerritorialesService } from "../services";
import { isMatch } from "../utils";
import 'react-bootstrap-typeahead/css/Typeahead.css';

export type { Departamento }

export const DepartamentosTypeahead = ({isInvalid, feedback, filterBy, ...props}: {feedback?: string, onLoad?: (options: Departamento[])=>void} & Omit<TypeaheadProps<Departamento>, "isLoading" | "options" | "onSearch">) => {


  const queryKey = "getDepartamentos"

  const buscar = useQuery(queryKey, ()=>{
    return UnidadesTerritorialesService.getDepartamentos()
  }, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  useEffect(()=>{
    if(buscar.data){
      props.onLoad && props.onLoad(buscar.data?.data)
    }
  }, [buscar.data, props.onLoad])
  
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
      clearButton
      emptyLabel="No se encontraron resultados"
      align="left"
      {...props}
      className={(buscar.isError || isInvalid) ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      filterBy={(departamento, props)=>{
        return (!props.text || isMatch(departamento.nombre, props)) 
          && (!filterBy || (typeof filterBy === "function" && filterBy(departamento, props)))
      }}
      isLoading={buscar.isFetching}
      options={options}
      labelKey="nombre"
      minLength={0}
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