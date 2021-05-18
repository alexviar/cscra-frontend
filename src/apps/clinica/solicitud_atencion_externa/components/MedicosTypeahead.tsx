
import { useEffect } from "react"
import { AxiosPromise } from "axios"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FaSync } from "react-icons/fa"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery } from 'react-query'
import { Medico, MedicosService } from "../services"
import { isMatch } from "../../../../commons/utils"
import 'react-bootstrap-typeahead/css/Typeahead.css'


export const MedicosTypeahead = ({isInvalid, feedback, filterBy, ...props}: {feedback?: string, onLoad?: (options: Medico[])=>void} & Omit<TypeaheadProps<Medico>, "isLoading" | "options" | "onSearch">) => {
  const queryKey = "medicos.buscar"

  const buscar = useQuery(queryKey, ()=>{
    return MedicosService.buscar() as AxiosPromise<Medico[]>
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
      filterBy={(medico, props)=>{
        return (isMatch(medico.nombreCompleto, props) || isMatch(medico.especialidad, props)) 
          && !!(typeof filterBy === "function" && filterBy(medico, props))
      }}
      isLoading={buscar.isFetching}
      options={buscar.data?.data || []}
      labelKey="nombreCompleto"
      minLength={0}
      renderMenuItemChildren={(medico) => {
        return <div>
          <div>{medico.nombreCompleto}</div>
          <div className={"small text-secondary"}>{medico.especialidad}</div> 
        </div>
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