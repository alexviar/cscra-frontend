import { Button, Col, Form, Spinner, Table } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import * as yup from 'yup'
import { Regional, RegionalesTypeahead } from "../../../../commons/components"
import { PlanService } from '../services'
import { Area, AreasTypeahead } from './AreasTypeahead'

type Inputs = {
  regional: Regional[]
  area: Area[]
  objetivoGeneral: string
  actividades: {
    nombre: string
    inicio: Date
    fin: Date
    indicadores: string
  }[]
}

const schema = yup.object().shape({
  regional: yup.array().length(1, "Debe indicar una regional"),
  area: yup.array().length(1, "Debe indicar un area"),
  objetivoGeneral: yup.string().label("objetivo general").required(),
  actividades: yup.array().min(1, "Debe indicar al menos una actividad").of(yup.object().shape({
    nombre: yup.string().required().max(150).test("unique", "El nombre debe ser único", function (value, context) {
      //@ts-ignore
      const count = context.from[1].value.actividades.filter((a:any)=>a.nombre === value).length
      return count === 1
    }),
    indicadores: yup.string().required().max(250),
    inicio: yup.date().emptyStringTo().typeError("No es una fecha valida").required(),
    fin: yup.date().emptyStringTo().typeError("No es una fecha valida").required().when('inicio', (inicio: any)=>{
      return inicio && yup.date().min(moment(inicio).add(1, 'days').toDate(), "La fecha de fin debe ser mayor a la fecha de inicio")
    })
  }))
})

export const PlanForm = () => {
  const history = useHistory<any>()
  const {
    control,
    handleSubmit,
    register,
    formState,
    watch
  } = useForm<Inputs>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      regional: [],
      area: [],
      actividades: []
    }
  })

  const formErrors = formState.errors

  const {
    fields: actividadesField,
    append: appendActividad,
    remove: removeActividad
  } = useFieldArray({
    control,
    name: 'actividades'
  })

  const queryClient = useQueryClient()

  const guardar = useMutation((inputs: Inputs) => {
    return PlanService.registrar({
      regionalId: inputs.regional![0].id,
      areaId: inputs.area![0].id,
      objetivoGeneral: inputs.objetivoGeneral,
      actividades:inputs.actividades.map(actividad => {
        return {
          ...actividad,
          inicio: (actividad.inicio as any)!.toISOString().split("T")[0],
          fin: (actividad.fin as any)!.toISOString().split("T")[0],
        }
      })
    })
  }, {
    onSuccess: ({data}) => {
      queryClient.invalidateQueries("planes.buscar")
      history.replace(`/seguimiento/planes/${data.id}`, {
        plan: data
      })
    }
  })

  return <Form onSubmit={handleSubmit((inputs)=>{
    guardar.mutate(inputs)
  })}>
    <h1 style={{fontSize: '1.75rem'}}>Plan</h1>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Regional</Form.Label>
        <Controller
          control={control}
          name="regional"
          render={({field, fieldState})=>{
            return <RegionalesTypeahead
              id="plan-form/regionales"
              isInvalid={!!fieldState.error}
              feedback={fieldState.error?.message}
              selected={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          }}
        />
      </Form.Group>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Area</Form.Label>
        <Controller
          control={control}
          name="area"
          render={({field, fieldState})=>{
            return <AreasTypeahead
              id="plan-form/regionales"
              isInvalid={!!fieldState.error}
              feedback={fieldState.error?.message}
              selected={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          }}
        />
      </Form.Group>
    </Form.Row>
    <Form.Group>
      <Form.Label>Objetivo general</Form.Label>
      <Form.Control
        isInvalid={!!formErrors.objetivoGeneral}
        {...register("objetivoGeneral")} />
      <Form.Control.Feedback type="invalid">{formErrors.objetivoGeneral?.message}</Form.Control.Feedback>
    </Form.Group>
    <h2 style={{fontSize: '1.5rem'}}>Actividades</h2>
    <div className="d-flex mb-2">
      <Button className="ml-auto" onClick={()=>appendActividad({})}>Agregar</Button>
    </div>
    <Table responsive>
      <thead>
        <tr>
          <th style={{width: 1}}>#</th>
          <th style={{minWidth: "15rem"}}>Nombre</th>
          <th style={{minWidth: "20rem"}}>Indicadores</th>
          <th style={{minWidth: "5rem"}}>Inicio</th>
          <th style={{minWidth: "5rem"}}>Fin</th>
          <th style={{width: 1}}></th>
        </tr>
      </thead>
      <tbody>
        {
          actividadesField.map((actividadField, index) => {
            return <tr key={actividadField.id}>
              <th scope="row">{index+1}</th>
              <td>
                <Form.Group>
                  <Form.Control 
                    isInvalid={!!(formErrors.actividades && formErrors.actividades[index]?.nombre)}
                    {...register(`actividades.${index}.nombre` as const)} />
                  <Form.Control.Feedback type="invalid">{(formErrors.actividades && formErrors.actividades[index]?.nombre)?.message}</Form.Control.Feedback>
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Control as="textarea"
                    isInvalid={!!(formErrors.actividades && formErrors.actividades[index]?.indicadores)}
                    {...register(`actividades.${index}.indicadores` as const)}/>
                  <Form.Control.Feedback type="invalid">{(formErrors.actividades && formErrors.actividades[index]?.indicadores)?.message}</Form.Control.Feedback>
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Control type="date" 
                    isInvalid={!!(formErrors.actividades && formErrors.actividades[index]?.inicio)}
                    {...register(`actividades.${index}.inicio` as const)}/>
                  <Form.Control.Feedback type="invalid">{(formErrors.actividades && formErrors.actividades[index]?.inicio)?.message}</Form.Control.Feedback>
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Control type="date" 
                    isInvalid={!!(formErrors.actividades && formErrors.actividades[index])?.fin}
                    {...register(`actividades.${index}.fin` as const)}/>
                  <Form.Control.Feedback type="invalid">{(formErrors.actividades && formErrors.actividades[index]?.fin)?.message}</Form.Control.Feedback>
                </Form.Group>
              </td>
              <td>
                <Button variant="danger" onClick={()=>removeActividad(index)}><FaTrash /></Button>
              </td>
            </tr>
          })
        }
      </tbody>
    </Table>
    <Form.Row>
        <Col>
          <Button type="submit">
            {guardar.isLoading ? <Spinner animation="border" className="mr-2" size="sm" /> : null}
            <span className="align-middle">Guardar</span>
          </Button>
        </Col>
      </Form.Row>
  </Form>
}