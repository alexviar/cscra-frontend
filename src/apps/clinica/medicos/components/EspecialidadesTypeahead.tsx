
import { useEffect, useMemo } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { FaSync } from 'react-icons/fa'
import { useQuery } from 'react-query'
import { Especialidad, EspecialidadesService } from "../../especialidades/services";
import { isMatch } from "../../../../commons/utils";
import 'react-bootstrap-typeahead/css/Typeahead.css';

export type { Especialidad }

export const EspecialidadesTypeahead = ({isInvalid, feedback, filterBy, ...props}: {feedback?: string, onLoad?: (options: Especialidad[])=>void} & Omit<TypeaheadProps<Especialidad>, "isLoading" | "options" | "onSearch">) => {
  const queryKey = "especialidades.buscar"

  const buscar = useQuery(queryKey, ()=>{
    return EspecialidadesService.buscar("")
  }, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
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
      className={"is-invalid"}
      isInvalid={buscar.isError || isInvalid}
      filterBy={(especialidad, props)=>{
        return (!props.text || isMatch(especialidad.nombre, props)) 
          && (!filterBy || (typeof filterBy === "function" && filterBy(especialidad, props)))
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