
import { useEffect, useMemo } from "react"
import { AxiosPromise, AxiosError } from "axios"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FaSync } from "react-icons/fa"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery } from 'react-query'
import { Medico, MedicoFilter, MedicosService } from "../services"
import { isMatch } from "../../../../commons/utils"
import 'react-bootstrap-typeahead/css/Typeahead.css'

export type { Medico }

type Props = {
  feedback?: string,
  filter?: MedicoFilter
  onLoad?: (options: Medico[])=>void
} & Omit<TypeaheadProps<Medico>, "isLoading" | "options">

export const MedicosTypeahead = ({isInvalid, feedback, filter, filterBy, ...props}: Props) => {
  const queryKey = ["medicos.buscar", filter]

  const buscar = useQuery(queryKey, ()=>{
    return MedicosService.buscar(filter) as AxiosPromise<Medico[]>
  }, {
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
      clearButton
      emptyLabel="No se encontraron resultados"
      align="left"
      {...props}
      disabled={!buscar.data}
      className={(buscar.isError || isInvalid) ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      filterBy={(medico, props)=>{
        return (!props.text || isMatch(medico.nombreCompleto, props) || isMatch(medico.especialidad, props))
          && (!filterBy || typeof filterBy === "function" && filterBy(medico, props))
      }}
      isLoading={!buscar.data}
      options={options}
      labelKey="nombreCompleto"
      minLength={0}
      renderMenuItemChildren={(medico) => {
        return <div>
          <div>{medico.nombreCompleto}</div>
          <div className={"small text-secondary"}>{medico.especialidad}</div> 
        </div>
      }}
    />
    <InputGroup.Append>
      <Button disabled={!buscar.data} variant={buscar.isError ? "outline-danger" : "outline-secondary"} onClick={()=>buscar.refetch()}><FaSync /></Button>
    </InputGroup.Append>
    <Form.Control.Feedback type="invalid">{
      (buscar.error as AxiosError)?.response?.data?.message || (buscar.error as AxiosError)?.message
      || feedback}</Form.Control.Feedback>
  </InputGroup>
}