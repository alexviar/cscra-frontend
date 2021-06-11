
import { useEffect, useMemo } from "react"
import { AxiosPromise, AxiosError } from "axios"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FaSync } from "react-icons/fa"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Prestacion, PrestacionesService } from "../services";
import { isMatch } from "../../../../commons/utils";
import 'react-bootstrap-typeahead/css/Typeahead.css';

export type { Prestacion }

export const PrestacionesTypeahead = ({
  isInvalid,
  feedback,
  filterBy,
  onChange,
  ...props
}: {feedback?: string, onLoad?: (options: Prestacion[])=>void} & Omit<TypeaheadProps<Prestacion>, "isLoading" | "options">) => {
  const queryKey = "prestaciones.buscar"

  const queryClient = useQueryClient()

  const buscar = useQuery(queryKey, ()=>{
    return PrestacionesService.buscar({}) as AxiosPromise<Prestacion[]>
  }, {
    // refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  const registrar = useMutation((nombre: string)=>{
    return PrestacionesService.registrar(nombre)
  }, {
    onSuccess: ({data})=>{
      queryClient.invalidateQueries("prestaciones.buscar", {inactive: true})
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

  const _onChange = (selected: Prestacion[])=>{
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
      className={(buscar.isError || isInvalid) ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      filterBy={(prestacion, props)=>{
        return (!props.text || isMatch(prestacion.nombre, props)) 
          && (!filterBy || (typeof filterBy === "function" && filterBy(prestacion, props)))
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
      (buscar.error as AxiosError)?.response?.data?.message || (buscar.error as AxiosError)?.message
      || (registrar.error as AxiosError)?.response?.data?.message || (registrar.error as AxiosError)?.message 
      || feedback}</Form.Control.Feedback>
  </InputGroup>
}