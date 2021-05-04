
import { forwardRef, MutableRefObject, useEffect, useRef, useState } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { FaSync } from 'react-icons/fa'
import { useQuery } from 'react-query'
import { Municipio, UnidadesTerritorialesService } from "../services";
import 'react-bootstrap-typeahead/css/Typeahead.css';


export const MunicipiosTypeahead = ({isInvalid, feedback, ...props}: {feedback?: string, onLoad?: (options: Municipio[])=>void} & Omit<TypeaheadProps<Municipio>, "isLoading" | "options">) => {


  const queryKey = "getMunicipios"

  const buscar = useQuery(queryKey, ()=>{
    return UnidadesTerritorialesService.getMunicipios()
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

  return <InputGroup hasValidation>
    <Typeahead
      className={buscar.isError || isInvalid ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      {...props}
      isLoading={buscar.isFetching}
      options={buscar.data?.data||[]}
      labelKey="nombre"
      minLength={0}
      renderMenuItemChildren={(prestacion) => {
        return prestacion.nombre
      }}
    />
    {buscar.isError ? <>
      <InputGroup.Append>
        <Button variant="outline-danger" onClick={()=>buscar.refetch()}><FaSync /></Button>
      </InputGroup.Append>
      <Form.Control.Feedback type="invalid">{buscar.error?.response?.message || buscar.error?.message || feedback}</Form.Control.Feedback>
    </>
    : null}
  </InputGroup>
}