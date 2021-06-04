import { AxiosResponse } from "axios"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { Alert, Button, Col, Form, Modal, ModalProps, Row, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import { ImperativeModal, ImperativeModalRef } from "./ImperativeModal"

type ImportOptions= {
  separator: string,
  format: string 
}

type Inputs = {
  archivo: FileList|null,
  separador: string,
  formatoSaltoLinea: string,
  aggrement: boolean
}

type Props = {
  // import: (file: File, options: ImportOptions) => void
  import: (
    file: File,
    options: ImportOptions
  )=>Promise<any>
} & ModalProps

export const ImportModal = forwardRef<ImperativeModalRef, Props>((props, ref)=>{
  
  const {
    register,
    formState,
    handleSubmit
  } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      archivo: null,
      separador: ",",
      formatoSaltoLinea: "UNIX",
      aggrement: false
    }
  })

  const importar = useMutation(({file, options}: {file: File, options: ImportOptions})=>{
    return props.import(file, options)
  })

  // const imperativeModalRef = useRef<ImperativeModalRef>(null)

  // useImperativeHandle(ref, () => ({
  //   show: (show: boolean)=>{
  //     imperativeModalRef.current?.show(show)
  //   }
  // }),[])
  
  return <ImperativeModal ref={ref} {...props}>
  <Modal.Header>
    Importar Datos
  </Modal.Header>
  <Modal.Body>
    <Form id="importar-especialidades-form" onSubmit={handleSubmit(({archivo, separador: separator, formatoSaltoLinea: format})=>{
      importar.mutate({
        file: archivo![0],
        options: {
          separator,
          format
        }
      })
    })}>
      {importar.data ? <Alert variant={importar.isError ? "danger" : "success"}>
        {importar.isError ? "Error" : "Importacion existosa"}
      </Alert> :  null}
      <Form.Group as={Row}>
        <Form.Label column sm={4}>Archivo</Form.Label>
        <Col className="d-flex align-items-center" sm={"auto"}>
          <Form.File
            isInvalid={!!formState.errors.archivo}
            {...register("archivo", {
              // required: rules.required(),
            })}
            feedback={formState.errors.archivo?.message}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm={4}>Separador</Form.Label>
        <Col xs={"auto"}>
          <Form.Control className="text-center" maxLength={1} style={{width: "2.5rem"}}
            isInvalid={!!formState.errors.separador}
            {...register("separador", {
              // required: rules.required()
            })}
          ></Form.Control>
          <Form.Control.Feedback type={"invalid"}>{formState.errors.separador?.message}</Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm={4}>Salto de linea</Form.Label>
        <Col className="d-flex" xs={"auto"}>
          <Form.Check inline type="radio" label="DOS" value="DOS" {...register("formatoSaltoLinea")}></Form.Check>
          <Form.Check inline type="radio" label="UNIX" value="UNIX" {...register("formatoSaltoLinea")}></Form.Check>
        </Col>
      </Form.Group>
      <Form.Check label="Entiendo los riesgos y he revisado cuidadosamente el contenido del archivo."
        isInvalid={!!formState.errors.aggrement}
        feedback={formState.errors.aggrement?.message}
        {...register("aggrement", {
          // required: rules.required()
        })}
      ></Form.Check>
    </Form>
  </Modal.Body>
  <Modal.Footer>
      <Button variant="danger" type="submit" form="importar-especialidades-form">
        {importar.isLoading ? <Spinner animation="border" size="sm"/> : null}
        Importar
      </Button>
      <Button>Cancelar</Button>
  </Modal.Footer>
</ImperativeModal>

})