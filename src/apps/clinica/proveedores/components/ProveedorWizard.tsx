import { useState } from "react"
import { Button, Col, Form, Spinner, Table } from "react-bootstrap"
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
  contractInfo,
  ...props
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
      prestacionIds: contractInfo.prestaciones!.map(pc => pc.prestacion.id)
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
    <div>
      <h2>Informacion general</h2>
      <Table>
        <tbody>
          <tr>
            <th scope="row">Tipo de proveedor</th>
            <td >{generalInfo.tipo == 1 ? "Médico" : generalInfo.tipo == 2 ? "Empresa" : null}</td>
          </tr>
          <tr>
            <th scope="row" style={{width: '1px'}}>NIT</th>
            <td>{generalInfo.nit}</td>
          </tr>
          {generalInfo.tipo == 1 ? 
            <>
              <tr>
                <th scope="row" style={{width: 1}}>Carnet de identidad</th>
                <td>{generalInfo.ci + (generalInfo.ciComplemento ? `-${generalInfo.ciComplemento}` : '')}</td>
              </tr>
              <tr>
                <th scope="row" style={{width: 1}}>Nombre</th>
                <td>{(generalInfo.apellidoPaterno ? generalInfo.apellidoPaterno + ' ' : '') + (generalInfo.apellidoMaterno ? generalInfo.apellidoMaterno + ' ' : '') + generalInfo.nombres}</td>
              </tr>
              <tr>
                <th scope="row">Especialidad</th>
                <td>{generalInfo?.especialidad![0].nombre}</td>
              </tr>
            </> :
            (generalInfo?.tipo == 2 ?
            <tr>
              <th scope="row" style={{width: 1}}>Nombre</th>
              <td>{generalInfo?.nombre}</td>
            </tr> : null)}
          <tr>
            <th scope="row">Regional</th>
            <td>{generalInfo.regional![0].nombre}</td>
          </tr>
        </tbody>
      </Table>
      <h2>Informacion de contacto</h2>
      {contactInfo ? <Table>
        <tbody>
          <tr>
            <th scope="row">Municipio</th>
            <td>{contactInfo.municipio![0].nombre}</td>
          </tr>
          <tr>
            <th scope="row">Direccion</th>
            <td>{contactInfo.direccion}</td>
          </tr>
          <tr>
            <th scope="row">Ubicación</th>
            <td>{Array.isArray(contactInfo.ubicacion) ?
              `${contactInfo.ubicacion[0]}, ${contactInfo.ubicacion[1]}` :
              `${contactInfo.ubicacion!.lat}, ${contactInfo.ubicacion!.lng}` }</td>
          </tr>
          <tr>
            <th>Teléfono 1</th>
            <td>{contactInfo.telefono1}</td>
          </tr>
          <tr>
            <th>Telefono 2</th>
            <td>{contactInfo.telefono2}</td>
          </tr>
        </tbody>
      </Table> : "Omitida"}
      <h2>Contrato</h2>
      <Table>
        <tbody>
          <tr>
            <th scope="row">Inicio</th>
            <td>{contractInfo.inicio}</td>
          </tr>
          <tr>
            <th scope="row">Fin</th>
            <td>{contractInfo.fin}</td>
          </tr>
          <tr>
            <th scope="row">Prestaciones</th>
            <td>
              <ul>
                {contractInfo.prestaciones.map((element)=>{
                  return <li>{element.prestacion.nombre}</li>
                })}
              </ul>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
    
    <Form.Row>
      <Col xs="auto">
        <Button onClick={props.previousStep}>
          Anterior
        </Button>
      </Col>
      <Col className="ml-auto" xs="auto">
        <Button
          onClick={()=>{
            guardar.mutate()
          }}
        >
          {guardar.isLoading ? <Spinner animation="border" size="sm" />: null}
          Guardar
        </Button>
      </Col>
    </Form.Row>
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