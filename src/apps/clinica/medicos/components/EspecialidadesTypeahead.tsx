
import { useEffect, useMemo } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { FaSync } from 'react-icons/fa'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Especialidad, EspecialidadesService } from "../../especialidades/services";
import { isMatch } from "../../../../commons/utils";
import 'react-bootstrap-typeahead/css/Typeahead.css';

export type { Especialidad }

export const EspecialidadesTypeahead = ({
  isInvalid,
  feedback,
  filterBy,
  onChange,
  ...props
}: {feedback?: string, onLoad?: (options: Especialidad[])=>void} & Omit<TypeaheadProps<Especialidad>, "isLoading" | "options" | "onSearch">) => {
  const queryKey = "especialidades.buscar"

  const queryClient = useQueryClient()

  const buscar = useQuery(queryKey, ()=>{
    return EspecialidadesService.buscar("")
  }, {
    // refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const registrar = useMutation((nombre: string)=>{
    return EspecialidadesService.registrar(nombre)
  }, {
    onSuccess: ({data})=>{
      queryClient.setQueryData(queryKey, (oldData: any) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            records: [oldData.data.records, data]
          }
        }
      })
      onChange && onChange([data])
    }
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

  const _onChange = (selected: Especialidad[])=>{
    if(selected.length){
      const option = selected[0] as any
      if(option.customOption){
        registrar.mutate(option.nombre)
        return
      }
    }
    onChange && onChange(selected)
  }

  return <InputGroup hasValidation>
    <Typeahead
      clearButton
      {...props}
      onChange={_onChange}
      allowNew
      //@ts-ignore
      newSelectionPrefix={<i>Crear nueva: </i>}
      emptyLabel={"No se encontraron resultados"}
      className={"is-invalid"}
      isInvalid={buscar.isError || isInvalid}
      filterBy={(especialidad, props)=>{
        return (!props.text || isMatch(especialidad.nombre, props)) 
          && (!filterBy || (typeof filterBy === "function" && filterBy(especialidad, props)))
      }}
      disabled={!buscar.data || registrar.isLoading}
      isLoading={buscar.isFetching || registrar.isLoading}
      options={options}
      labelKey="nombre"
    />
    <InputGroup.Append>
      <Button variant={buscar.isError ? "outline-danger" : "outline-secondary"} onClick={()=>buscar.refetch()}><FaSync /></Button>
    </InputGroup.Append>
    <Form.Control.Feedback type="invalid">{
      buscar.error?.response?.message || buscar.error?.message
      || registrar.error?.response?.message || registrar.error?.message 
      || feedback}</Form.Control.Feedback>
  </InputGroup>
}