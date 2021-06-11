import { useState } from "react"
import { Button, Col, Form, Spinner } from "react-bootstrap"
import StepWizard, { StepWizardChildProps } from "react-step-wizard"
import { useHistory } from "react-router-dom"
import { useMutation, useQueryClient } from "react-query"
import { Inputs as ContratoInputs, ContratoForm } from "../../contratos/components/ContratoForm"
import { Inputs as ProveedorInputs, ProveedorMedicoInput, ProveedorForm } from "./ProveedorForm"
import { Inputs as ContactoInputs, ContactoForm } from "./ContactoForm"
import { ProveedoresService } from "../services"


const GeneralInfoStep = (props: Partial<StepWizardChildProps> & {
  onSubmit: (data: ProveedorInputs) => void
}) => {
  return <>
    <ProveedorForm onSubmit={(data) => {
      props.onSubmit(data)
      props.nextStep!()
    }} />
    <Form.Row>
      <Col className="ml-auto" xs="auto">
        <Button
          type="submit"
          form="proveedor-form"
        >
          Siguiente
        </Button>
      </Col>
    </Form.Row>
  </>
}

const ContactInfoStep = (props: Partial<StepWizardChildProps> & {
  onSubmit: (data: ContactoInputs) => void
}) => {
  return <>
    <ContactoForm onSubmit={(data) => {
        props.onSubmit(data)
        props.nextStep!()
      }}
    />
    <Form.Row>
      <Col xs="auto">
        <Button onClick={props.previousStep}>
          Anterior
        </Button>
      </Col>
      <Col className="ml-auto" xs="auto">
        <Button variant="link" 
          onClick={props.nextStep}>
          Omitir
        </Button>
      </Col>
      <Col xs="auto">
        <Button
          type="submit"
          form="proveedor-contacto-form"
        >
          Siguiente
        </Button>
      </Col>
    </Form.Row>
  </>
}

const ContractInfoStep = (props: Partial<StepWizardChildProps> & {
  onSubmit: (data: ContratoInputs) => void
}) => {
  return <>
    <ContratoForm onSubmit={(data) => {
      props.onSubmit(data)
      props.nextStep!()
    }} />
    <Form.Row>
      <Col xs="auto">
        <Button onClick={props.previousStep}>
          Anterior
        </Button>
      </Col>
      <Col className="ml-auto" xs="auto">
        <Button
          type="submit"
          form="proveedor-contrato-form"
        >
          Siguiente
        </Button>
      </Col>
    </Form.Row>
  </>
}

const FinishStep = ({
  generalInfo,
  contactInfo,
  contractInfo
}: Partial<StepWizardChildProps> & {
  generalInfo: ProveedorInputs
  contactInfo?: ContactoInputs
  contractInfo: ContratoInputs
}) => {

  // console.log(generalInfo, contactInfo, contractInfo)

  const history = useHistory()

  const queryClient = useQueryClient()

  function isMedico(data: ProveedorInputs): data is ProveedorMedicoInput{
    return data.tipo == 1
  }

  const guardar = useMutation(()=>{

    const general = isMedico(generalInfo) ? {
      tipoId: generalInfo.tipo!,
      nit: generalInfo.nit,
      ci: generalInfo.ci!,
      ciComplemento: generalInfo.ciComplemento,
      apellidoPaterno: generalInfo.apellidoPaterno,
      apellidoMaterno: generalInfo.apellidoMaterno,
      nombres: generalInfo.nombres!,
      especialidadId: generalInfo.especialidad![0].id,
      regionalId: generalInfo.regional![0].id
    } : {
      tipoId: generalInfo.tipo!,
      nit: generalInfo.nit,
      nombre: generalInfo.nombre!,
      regionalId: generalInfo.regional![0].id
    }

    let contacto
    if(contactInfo){
      let lat, lng
      if(Array.isArray(contactInfo.ubicacion)){
        [lat, lng] = contactInfo.ubicacion!
      }
      else{
        ({lat, lng} = contactInfo.ubicacion!)
      }
      contacto = {
        municipioId: contactInfo.municipio![0].id,
        direccion: contactInfo.direccion!,
        ubicacion: {
          latitud: lat,
          longitud: lng
        },
        telefono1: contactInfo.telefono1!,
        telefono2: contactInfo.telefono2!
      }
    }

    const contrato = {
      inicio: (contractInfo.inicio! as any).toISOString().split("T")[0],
      fin: (contractInfo.fin as any)?.toISOString()?.split("T")[0],
      // regionalId: contractInfo.regional![0].id,
      prestacionIds: []//contractInfo.prestaciones!.map(pc => pc.prestacion.id)
    }



    return ProveedoresService.registrar({
      general, contacto, contrato
    })
  }, {
    onSuccess: ({data})=>{
      queryClient.invalidateQueries("proveedores.buscar");
      history.push(`/clinica/proveedores/${data.id}`)
    }
  })

  return <div>
    <p>Fin.</p>
    <Button
      onClick={()=>{
        guardar.mutate()
      }}
    >
      {guardar.isLoading ? <Spinner animation="border" size="sm" />: null}
      Guardar
    </Button>
  </div>
}

export const ProveedorWizard = () => {

  const [generalInfo, setGeneralInfo] = useState<ProveedorInputs>()
  const [contactInfo, setContactInfo] = useState<ContactoInputs>()
  const [contractInfo, setContractInfo] = useState<ContratoInputs>()

  return <StepWizard>
    <GeneralInfoStep onSubmit={(data)=>{
      setGeneralInfo(data)
    }} />
    <ContactInfoStep onSubmit={(data)=>{
      setContactInfo(data)
    }} />
    <ContractInfoStep onSubmit={(data)=>{
      setContractInfo(data)
    }} />
    <FinishStep 
      generalInfo={generalInfo!}
      contactInfo={contactInfo}
      contractInfo={contractInfo!}
    />
  </StepWizard>
}