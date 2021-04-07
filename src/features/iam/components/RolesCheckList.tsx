import React, { useEffect } from 'react'
import { Form, ListGroup } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'
import { useQuery } from 'react-query'
import { Roles } from '../services'
import { Role } from '../state'

type Props = {
  defaultSelection?: number[],
}
export default ()=>{
  const {register, formState: { errors }, watch, setValue, getValues} = useFormContext()
  const fetchRoles = useQuery("fetchRoles", ()=>{
    console.log("fetchingRoles")
    return Roles.fetchAll()
  }, {
    enabled: false,
    // refetchOnWindowFocus: false
  })

  const roles = fetchRoles.data?.data || [] as Role[]

  useEffect(()=>{
    register("roleIds", {
      validate: {
        nonEmpty: (value)=>value.length>0 || "Debe elegir al menos un rol."
      }
    })
  }, [register])

  useEffect(()=>{
    fetchRoles.refetch()
  }, [])
  return <>
    <ListGroup as="ul" className={`overflow-auto flex-grow-1 ${!errors.roleIds ? "" : "is-invalid"}`} style={{height: "10rem"}}>
      {fetchRoles.isFetching ? "Cargando" : fetchRoles.isError ? "Error" : roles.map((d, i)=>{
        return <ListGroup.Item key={d.id} as="li"
          className="py-2 px-3 text-capitalize"
          action
        >
          <Form.Check type="checkbox"
            label={d.name}
            isInvalid={!!errors.roleIds}
            name={`roleIds[${d.id}]`}
            // ref={register({
            //   validate: {
            //     nonEmpty: (value)=>watch("roles").some((checked: boolean)=>checked) || "Debe elegir al menos un rol"
            //   }
            // })}
            onChange={(e)=>{
              const checked = e.target.checked
              const roleIds = getValues("roleIds") as number[]
              setValue("roleIds", checked ? [
                ...roleIds,
                d.id
              ] : roleIds.filter(id=>id!=d.id), {
                shouldValidate: true
              })
            }}
          />
        </ListGroup.Item>
      })}
    </ListGroup>
    <Form.Control.Feedback type="invalid">{errors.roleIds?.message}</Form.Control.Feedback>
  </>
}