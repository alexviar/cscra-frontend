import { useState } from "react"
import { Button, Breadcrumb, Col, Form, Spinner } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "react-query"
import { useForm, FormProvider } from "react-hook-form"
import { Inputs as ProveedorInputs, ProveedorFieldset } from "./ProveedorFieldset"
import { Inputs as ContactoInputs, ContactoFieldset } from "./ContactoFieldset"
import { Empresa, Medico, InformacionContacto, ProveedoresService } from "../services"


// const GeneralInfoStep = (props: Partial<StepWizardChildProps>) => {
//   return <>
//     <ProveedorFieldset />
//     <Form.Row>
//       <Col className="ml-auto" xs="auto">
//         <Button
//           type="button"
//           onClick={props.nextStep!}
//         >
//           Siguiente
//         </Button>
//       </Col>
//     </Form.Row>
//   </>
// }

// const ContactInfoStep = (props: Partial<StepWizardChildProps> & {isLoading: boolean}) => {
//   return <>
//     <ContactoFieldset />
//     <Form.Row>
//       <Col className="mr-auto" xs="auto">
//         <Button
//           type="button"
//           onClick={props.previousStep}
//         >
//           Anterior
//         </Button>
//       </Col>
//       <Col className="ml-auto" xs="auto">
//         <Button
//           type="submit"
//         >
//           Guardar
//         </Button>
//       </Col>
//     </Form.Row>
//   </>
// }

type Inputs = ProveedorInputs & ContactoInputs

export const ProveedorWizard = () => {

  const {
    id
  } = useParams<{id?: string}>()

  const formMethods = useForm({
    defaultValues: {
      tipo: 1
    }
  })

  const queryClient = useQueryClient()

  const guardar = useMutation((values: Inputs)=>{

    let general: Omit<Empresa, "id" | "estado"> | Omit<Medico, "id" | "estado" | "nombreCompleto">
    if(values.tipo == 1) {
      general = {
        tipo: values.tipo!,
        nit: values.nit!,
        ci: {
          raiz: values.ci!,
          complemento: values.ciComplemento!
        },
        apellidoPaterno: values.apellidoPaterno!,
        apellidoMaterno: values.apellidoMaterno!,
        nombre: values.nombre!,
        especialidad: values.especialidad!,
        regionalId: values.regional![0].id
      }
    }
    else {
      general = {
        tipo: values.tipo!,
        nit: values.nit!,
        nombre: values.nombre!,
        regionalId: values.regional![0].id
      }
    }

    let lat, lng
    if(Array.isArray(values.ubicacion)){
      [lat, lng] = values.ubicacion!
    }
    else{
      ({lat, lng} = values.ubicacion!)
    }
    const contacto: InformacionContacto = {
      direccion: values.direccion!,
      ubicacion: {
        latitud: lat,
        longitud: lng
      },
      telefono1: values.telefono1!,
      telefono2: values.telefono2!
    }

    return ProveedoresService.registrar({
      ...general, ...contacto
    })
  }, {
    onSuccess: ()=>{
      queryClient.invalidateQueries("proveedores.buscar");
    }
  })

  return <FormProvider {...formMethods}>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{to: "/clinica/proveedores"}}>Proveedores</Breadcrumb.Item>
      {id ? <Breadcrumb.Item active>{id}</Breadcrumb.Item> : null}
      <Breadcrumb.Item active>{!id ? "Registro" : "Edición"}</Breadcrumb.Item>
    </Breadcrumb>
    <Form>
      {/* <h1 style={{fontSize: "1.75rem"}}>Registro de proveedores</h1> */}
      {/* {renderAlert()}
      <StepWizard nav={}>
        <GeneralInfoStep />
        <ContactInfoStep isLoading={guardar.isLoading} />
      </StepWizard> */}
      <ProveedorFieldset />
      <ContactoFieldset />
    </Form>
  </FormProvider>
}