
import { useEffect, useMemo } from "react"
import { AxiosPromise } from "axios"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FaSync } from "react-icons/fa"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery } from 'react-query'
import { Prestacion, PrestacionesService } from "../services/PrestacionesService";
import { isMatch } from "../../../../commons/utils";
import 'react-bootstrap-typeahead/css/Typeahead.css';

export type { Prestacion }

export const PrestacionesTypeahead = ({isInvalid, feedback, filterBy, ...props}: {feedback?: string, onLoad?: (options: Prestacion[])=>void} & Omit<TypeaheadProps<Prestacion>, "isLoading" | "options">) => {
  const queryKey = "prestaciones.buscar"

  const buscar = useQuery(queryKey, ()=>{
    return PrestacionesService.buscar({}) as AxiosPromise<Prestacion[]>
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
      filterBy={(prestacion, props)=>{
        return (!props.text || isMatch(prestacion.nombre, props)) 
          && (!filterBy || (typeof filterBy === "function" && filterBy(prestacion, props)))
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
  </InputGroup>
}