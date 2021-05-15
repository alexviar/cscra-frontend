import { useCallback, useEffect, useMemo, useState } from 'react'
import { Accordion, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from 'react-query'
import { useParams, useHistory } from "react-router-dom"
import { RegionalesTypeahead } from "../../../../commons/components"
import { Regional, RegionalesService } from "../../../../commons/services"
import { UserService, User, Rol } from "../services"
import { RolesCheckList } from './RolesCheckList'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Permisos } from '../../../../commons/auth/constants'
import { useLoggedUser } from '../../../../commons/auth/hooks'


type Inputs = {
  informacionPersonal: {
    ci: string,
    ciComplemento: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    nombres: string
  }
  informacionUsuario: {
    username: string,
    password?: string,
    passwordRepeat?: string,
    roles: Rol[],
    regional: Regional[]
  }
}

export const UserForm = () => {

  const loggedUser = useLoggedUser()

  const { id } = useParams<{
    id?: string
  }>()

  const schema = useMemo(()=> yup.object().shape({
    informacionPersonal: yup.object().shape({
      ci: yup.number().label("carnet de identidad"),
      ciComplemento: yup.lazy(value => value ? yup.string().label("'complemento'").trim().length(2) : yup.string().nullable().optional()),
      apellidoPaterno: yup.string().label("apellido paterno").trim().when("apellidoMaterno", {
        is: (apellidoMaterno: string) => !apellidoMaterno,
        then: yup.string().required("Debe proporcionar al menos un apellido")
      }),
      apellidoMaterno: yup.string().label("apellido materno").trim().when("apellidoPaterno", {
        is: (apellidoPaterno: string) => !apellidoPaterno,
        then: yup.string().required("Debe proporcionar al menos un apellido")
      }),
      nombres: yup.string().label("nombres").trim().required().label("'Nombres'"),
    }, [["apellidoMaterno", "apellidoPaterno"]]),
    informacionUsuario: yup.object().shape(id ? {
        roles: yup.array().label("roles").min(1, "Debe seleccionar al menos un rol")
      } : {
      username: yup.string().label("usuario").required().matches(/[a-zA-Z0-9]{4,}/).min(4).max(16),
      password: yup.string().label("contraseña").min(8).max(32).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "La contraseña debe contener al menos un caracter en minuscula, uno en mayuscula, un número y uno de los siguientes caracter especial: !@#$%^&*")
        .required(),
      passwordRepeat: yup.string().label("confirmar contraseña").test("password-match", "Las contraseñas no coinciden", function (value) {
        const { parent: { password } } = this
        return value === password
      }),
      regional: yup.array().length(1),
      roles: yup.array().label("roles").min(1, "Debe seleccionar al menos un rol")
    })
  }), [])

  const {
    control,
    formState,
    handleSubmit,
    register,
    setValue,
    trigger,
    watch
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      informacionUsuario: {
        roles: [],
        regional: []
      }
    }
  })

  const history = useHistory<{
    user: User
  }>()

  const queryKey = ["cargarUsuario", id];
  const cargar = useQuery(queryKey, () => {
    return UserService.cargar(parseInt(id!))
  }, {
    enabled: !!id && !history.location.state?.user
  })

  const guardar = useMutation(({informacionPersonal, informacionUsuario}: Inputs) => {
    return id ? UserService.actualizar(parseInt(id), {
      regionalId: informacionUsuario.regional[0]!.id,
      roles: informacionUsuario.roles.map(r => r.name),
      ci: parseInt(informacionPersonal.ci),
      ciComplemento: informacionPersonal.ciComplemento,
      apellidoPaterno: informacionPersonal.apellidoPaterno,
      apellidoMaterno: informacionPersonal.apellidoMaterno,
      nombres: informacionPersonal.nombres
    }) : UserService.registrar({
      username: informacionUsuario.username,
      password: informacionUsuario.password as string,
      regionalId: informacionUsuario.regional[0]!.id,
      roles: informacionUsuario.roles.map(r => r.name),
      ci: parseInt(informacionPersonal.ci),
      ciComplemento: informacionPersonal.ciComplemento,
      apellidoPaterno: informacionPersonal.apellidoPaterno,
      apellidoMaterno: informacionPersonal.apellidoMaterno,
      nombres: informacionPersonal.nombres
    })
  }, {
    onSuccess: ({data}) => {
      history.replace(`/iam/usuarios/${data.id}`, {
        user: data
      })
    }
  })

  const [regionales, setRegionales] = useState<Regional[]>([])

  const filterRegional = useCallback((regional: Regional)=>{
    return loggedUser.can(Permisos.REGISTRAR_USUARIOS) ? true : (regional.id == loggedUser.regionalId)
  }, [loggedUser])

  const user = cargar.data?.data || history.location.state?.user
  const formErrors = formState.errors

  useEffect(()=>{
    if(user && regionales.length) {
      setValue("informacionPersonal", {
        ci: String(user.ciRaiz),
        ciComplemento: user.ciComplemento,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        nombres: user.nombres
      })
      setValue("informacionUsuario", {
        username: user.username,
        roles: user.roles,
        regional: [regionales.find(r=>r.id == user.id)!]
      })
    }
  }, [user])

  return <>
    <Form onSubmit={handleSubmit((data) => {
      guardar.mutate(data)
    })}>
      <h1 style={{ fontSize: "2rem" }}>Usuarios</h1>
      <Accordion className="mb-2" defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} className={["text-light",
            formErrors.informacionPersonal ? "bg-danger" : "bg-primary"
          ].join(" ")} eventKey="0">
            Información personal
            </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col} xs={8} md={4}>
                  <Form.Label title="Numero raiz del carnet de identidad">Carnet de identidad</Form.Label>
                  <Form.Control type="number"
                    isInvalid={!!formState.errors.informacionPersonal?.ci}
                    {...register("informacionPersonal.ci")}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">{formErrors.informacionPersonal?.ci?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} xs={4} md={2}>
                  <Form.Label title="Complemento del carnet de identiad">Complemento</Form.Label>
                  <Form.Control
                    isInvalid={!!formErrors.informacionPersonal?.ciComplemento}
                    {...register("informacionPersonal.ciComplemento")}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">{formErrors.informacionPersonal?.ciComplemento?.message}</Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} lg={4}>
                  <Form.Label>Apellido Paterno</Form.Label>
                  <Form.Control
                    isInvalid={!!formErrors.informacionPersonal?.apellidoPaterno}
                    {...register("informacionPersonal.apellidoPaterno")}
                    onChange={(e)=>{
                      register("informacionPersonal.apellidoPaterno").onChange(e)
                      formState.isSubmitted && trigger("informacionPersonal.apellidoMaterno")
                    }}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.informacionPersonal?.apellidoPaterno?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} lg={4}>
                  <Form.Label>Apellido Materno</Form.Label>
                  <Form.Control
                    isInvalid={!!formErrors.informacionPersonal?.apellidoMaterno}
                    {...register("informacionPersonal.apellidoMaterno")}
                    onChange={(e)=>{
                      register("informacionPersonal.apellidoPaterno").onChange(e)
                      formState.isSubmitted && trigger("informacionPersonal.apellidoMaterno")
                    }}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.informacionPersonal?.apellidoMaterno?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} lg={4}>
                  <Form.Label>Nombres</Form.Label>
                  <Form.Control
                    isInvalid={!!formState.errors.informacionPersonal?.nombres}
                    {...register("informacionPersonal.nombres")}
                  />
                  <Form.Control.Feedback type="invalid">{formState.errors.informacionPersonal?.nombres?.message}</Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} className={["text-light", formErrors.informacionUsuario ? "bg-danger" : "bg-primary"].join(" ")} eventKey="1">
            Informacion de usuario
            </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Form.Row>
                <Form.Group controlId="username" as={Col} md={4}>
                  <Form.Label >Usuario</Form.Label>
                  <Form.Control
                    disabled={!!id}
                    isInvalid={!!formState.errors.informacionUsuario?.username}
                    {...register("informacionUsuario.username")}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">{formState.errors.informacionUsuario?.username?.message}</Form.Control.Feedback>
                </Form.Group>
                {id ? null : <><Form.Group as={Col} md={4}>
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password"
                    isInvalid={!!formState.errors.informacionUsuario?.password}
                    {...register("informacionUsuario.password")}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">{formState.errors.informacionUsuario?.password?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control type="password"
                    isInvalid={!!formState.errors.informacionUsuario?.passwordRepeat}
                    {...register("informacionUsuario.passwordRepeat", {
                      required: { value: true, message: "Este campo es requerido" },
                      validate: {
                        matchPassword: (value) => value === watch('informacionUsuario.password') || "Las contraseñas no coinciden"
                      }
                    })}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">{formState.errors.informacionUsuario?.passwordRepeat?.message}</Form.Control.Feedback>
                </Form.Group></>}
              </Form.Row>
              <Form.Group>
                <Form.Label>Regional</Form.Label>
                <Controller
                  name="informacionUsuario.regional"
                  control={control}
                  render={({ field, fieldState }) => {
                    return <RegionalesTypeahead
                      id="usuario/regionales-typeahead"
                      onLoad={setRegionales}
                      isInvalid={!!fieldState.error}
                      feedback={fieldState.error?.message}
                      filterBy={filterRegional}
                      selected={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  }}
                />
              </Form.Group>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Roles</Form.Label>
                  <Controller
                    name="informacionUsuario.roles"
                    control={control}
                    render={({ field, fieldState }) => {
                      return <><RolesCheckList
                        isInvalid={!!fieldState.error}
                        onChange={field.onChange}
                        selected={field.value}
                      />
                      <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback></>
                    }}
                  />
                </Form.Group>
              </Form.Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Form.Row>
        <Col>
          <Button type="submit">
            {guardar.isLoading ? <Spinner animation="border" className="mr-2" size="sm" /> : null}
            <span className="align-middle">Guardar</span>
          </Button>
        </Col>
      </Form.Row>
    </Form>
  </>
}