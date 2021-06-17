import { useEffect } from "react"
import { Dropdown } from "react-bootstrap"
import { useMutation, useQueryClient, QueryKey } from "react-query"
import { Link, useParams } from "react-router-dom"
import { VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Contrato, ContratosService } from "../services"
import { ContratoPolicy } from "../policies"

type Props = {
  contrato: Contrato
  queryKey: QueryKey
}
export const RowOptions = ({contrato, queryKey}: Props) => {

  const { id: idProveedor } = useParams<{
    id: string
  }>()

  const queryLoader = useModal("queryLoader")

  const queryClient = useQueryClient()

  const extender = useMutation("contratos.extender", ()=>{
    return ContratosService.extender(parseInt(idProveedor), contrato.id)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey)
      queryLoader.close()
    },
    onError: (error) => {
      queryLoader.open({
        state: "error",
        error
      })
    }
  })

  const consumir = useMutation("contratos.consumir", ()=>{
    return ContratosService.consumir(parseInt(idProveedor), contrato.id)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey)
      queryLoader.close()
    },
    onError: (error) => {
      queryLoader.open({
        state: "error",
        error
      })
    }
  })

  const anular = useMutation("contratos.anular", ()=>{
    return ContratosService.anular(parseInt(idProveedor), contrato.id)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey)
      queryLoader.close()
    },
    onError: (error) => {
      queryLoader.open({
        state: "error",
        error
      })
    }
  })

  return <Dropdown style={{position: "initial"}}>
    <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
      variant="link" id={`dropdown-contratos-proveedor-${contrato.id}`}
    />
    <Dropdown.Menu>
      <ProtectedContent
        authorize={ContratoPolicy.view}
      >
        <Dropdown.Item as={Link} to={{
          pathname: `/clinica/proveedores/${idProveedor}/contratos/${contrato.id}`,
          state: {
            contrato
          }
        }} ><span className="align-middle">Ver</span></Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={ContratoPolicy.extender}
      >
        <Dropdown.Item onClick={()=>{
          queryLoader.open({state:"loading"})
          extender.mutate()
        }}><span className="align-middle">Extender</span></Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={ContratoPolicy.consumir}
      >
        <Dropdown.Item onClick={()=>{
          queryLoader.open({state:"loading"})
          consumir.mutate()
        }}><span className="align-middle">Consumir</span></Dropdown.Item>
      </ProtectedContent>
      <ProtectedContent
        authorize={ContratoPolicy.anular}
      >
        <Dropdown.Item onClick={()=>{
          queryLoader.open({state:"loading"})
          anular.mutate()
        }}><span className="align-middle">Anular</span></Dropdown.Item>
      </ProtectedContent>
    </Dropdown.Menu>
  </Dropdown>
}