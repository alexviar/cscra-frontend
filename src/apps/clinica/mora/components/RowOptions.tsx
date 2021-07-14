import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
import { useMutation, useQueryClient, QueryKey } from "react-query"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { ListaMoraItem, ListaMoraService } from "../services"
import { ListaMoraPolicy } from "../policies"

type Props = {
  item: ListaMoraItem
  queryKey: QueryKey
}
export const RowOptions = ({item, queryKey}: Props) => {

  const modal = useModal("queryLoader")

  const queryClient = useQueryClient()

  const quitar = useMutation(()=>{
    return ListaMoraService.quitar(item.empleadorId)
  }, {
    onSuccess: ()=>{
      modal.close()
      queryClient.setQueryData(queryKey, (oldData: any) => {
        console.log(oldData)
        return {
          ...oldData,
          data: {
            ...oldData.data,
            records: oldData.data.records.filter((i: any)=>{
              return i !== item
            })
          }
        }
      })
    }
  })

  useEffect(()=>{
    if(quitar.status == "loading"){
      modal.open({
        state: "loading"
      })
    }
    else if(quitar.status == "error"){
      console.log(quitar.error)
      modal.open({
        state: "error",
        error: quitar.error
      })
    }
  }, [quitar.status])

  return <Dropdown>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-${item.id}`}
    />
    
    <Dropdown.Menu>
      <ProtectedContent
        authorize={ListaMoraPolicy.quitar}
      >
        <Dropdown.Item className="text-danger" href="#" onClick={() => {
          if (window.confirm("¿Está seguro?")) {
            quitar.mutate()
          }
        }}>Quitar</Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>  
}