import React, { useEffect, useState } from 'react'
import { Form, ListGroup } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { Permissions } from '../services'

type Props = {
  isInvalid?: boolean,
  defaultChecked: string[],
  onChange?: (permission: string, checked: boolean)=>void
}
export default (props: Props)=>{
  const { isInvalid, onChange } = props
  const fetchPermissions = useQuery("fetchPermissions", ()=>{
    console.log("fetchingRoles")
    return Permissions.fetchAll()
  }, {
    enabled: false,
    refetchOnWindowFocus: false
  })
  // const [checked, setChecked] = useState<string[]>(props.defaultChecked)

  const permissions = fetchPermissions.data?.data || [] as string[]

  useEffect(()=>{
    fetchPermissions.refetch()
  }, [])
  console.log("isInvalid", props)

  return <>
    <ListGroup className={`overflow-auto flex-grow-1 ${!isInvalid ? "" : "is-invalid"}`} style={{height: "10rem"}}>
      {fetchPermissions.isFetching ? "Cargando" : fetchPermissions.isError ? "Error" : permissions.map((d, i)=>{
        return <ListGroup.Item key={d} as="li"
          className="py-2 px-3 text-capitalize"
          action
        >
          <Form.Check type="checkbox"
            checked={props.defaultChecked.some(p=>p==d)}
            label={d}
            isInvalid={isInvalid}
            onChange={(e)=>{
              // const newState = e.target.checked ? [
              //   ...checked,
              //   d
              // ] : checked.filter(p=>p!=d)
              // setChecked(newState)
              props.onChange && props.onChange(d, e.target.checked)
            }}
          />
        </ListGroup.Item>
      })}
    </ListGroup>
  </>
}