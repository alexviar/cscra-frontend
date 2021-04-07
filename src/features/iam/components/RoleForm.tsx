import React, { useCallback, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, ListGroup, InputGroup, FormControl, Spinner } from 'react-bootstrap'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { FaExternalLinkSquareAlt } from 'react-icons/fa'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import * as rules from '../../../commons/components/rules'
import { Roles } from '../services'
import { Role } from '../state'
import PermissionsCheckList from './PermissionsCheckList'

type Inputs = {
  name: string,
  description: string,
  permissions: string[]
}
export default () => {
  const { action, id } = useParams<{
    action: string,
    id: string
  }>()
  const history = useHistory<{
    from?: string
  }>()
  
  const {
    handleSubmit,
    register,
    control,
    formState: {errors},
    reset,
    watch,
    getValues
  } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      permissions: []
    }
  })

  const fetchRole = useQuery(["fetchRole", id], ()=>{
    return Roles.fetch(parseInt(id))
  }, {
    enabled: false,
  })

  const saveRole = useMutation((data: Role)=>{
    if(id){
      return Roles.update(data)
    }
    else{
      return Roles.register(data)
    }
  })

  console.log("Values", watch())
  console.log("FetchRole", fetchRole)

  useEffect(()=>{
    console.log("Mounting")
  }, [])

  useEffect(()=>{
    if(!fetchRole.data && id){
      fetchRole.refetch()
    }
  }, [id])

  useEffect(()=>{
    console.log("Change data", fetchRole.data)
    reset({
      name: fetchRole.data?.data.name,
      description: fetchRole.data?.data.description,
      permissions: fetchRole.data?.data.permissions
    })
  }, [fetchRole.data])

  if(fetchRole.isFetching){
    return <Spinner animation="border" />
  }
  console.log("Data", fetchRole.data)

  return <Form id="role-form" onSubmit={handleSubmit((data) => {
        console.log(data)
        saveRole.mutate({
          id: parseInt(id),
          createdAt: undefined,
          updatedAt: undefined,
          ...data
        })
      })}>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" className="text-capitalize"
            isInvalid={!!errors.name}
            {...register("name", {
              required: rules.required(),
              maxLength: rules.maxLength(32)
            })}
          />
          <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control as="textarea"
            isInvalid={!!errors.description}
            name="description" 
            // ref={register({
            //   maxLength: rules.maxLength(250)
            // })} 
            />
            <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
            <Form.Label >Permisos</Form.Label>
            <Controller
              name="permissions"
              control={control}
              rules={{
                validate: {
                  nonEmpty: (value)=>value.length>0 || "Debe elegir al menos uno."
                }
              }}
              render={(props)=>{
                return <PermissionsCheckList
                  defaultChecked={watch("permissions")||[] as string[]}
                  isInvalid={!!errors.permissions} onChange={(permission, checked)=>{
                    // props.onChange(checked ? [
                    //   ...watch("permissions"),
                    //   permission
                    // ] : watch("permissions").filter(p=>p!=permission))
                  }}
                />
              }}
            />
            <Form.Control.Feedback type="invalid">{(errors.permissions as FieldError|undefined)?.message}</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">Guardar</Button>
      </Form>
}