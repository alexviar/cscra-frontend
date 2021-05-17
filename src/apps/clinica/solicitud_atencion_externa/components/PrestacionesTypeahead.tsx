
import { useEffect, useState } from "react"
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

  return <InputGroup hasValidation>
    <Typeahead
      className={buscar.isError || isInvalid ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      {...props}
      filterBy={(prestacion, props)=>{
        return isMatch(prestacion.nombre, props) && !!(typeof filterBy === "function" && filterBy(prestacion, props))
      }}
      isLoading={buscar.isFetching}
      options={buscar.data?.data||[]}
      labelKey="nombre"
      minLength={0}
      renderMenuItemChildren={(regional) => {
        return regional.nombre
      }}
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