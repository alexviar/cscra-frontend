import React, { useEffect, useMemo, useState, ComponentProps } from 'react'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import { FaPlus } from 'react-icons/fa'
import { useHistory, useParams } from 'react-router'
import moment from 'moment'
import { Line } from 'react-chartjs-2';
import { useModal } from '../../../../commons/reusable-modal'
import { ProtectedContent } from '../../../../commons/auth'
import { PlanPolicy } from '../policies'
import { Actividad } from '../services'
import { useCargarPlan } from '../queries'
import { AvanceForm } from './AvanceForm'
import { HistorialRowOptions } from './HistorialRowOptions'


const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        },
        min: 0,
        max: 100
      },
    ],
  },
};

const LineChart = React.memo((props: ComponentProps<typeof Line>)=><Line {...props}/>)

export const ActividadView = ()=>{
  const history = useHistory<{actividad: Actividad}>()
  const params = useParams<{
    planId: string
    actividadId: string
  }>()
  const planId = parseInt(params.planId)
  const actividadId = parseInt(params.actividadId)

  // const queryLoader = useModal('queryLoader')

  const [avanceFormVisible, showAvanceForm] = useState(false)

  const cargar = useCargarPlan(planId)
  // const cargar = useCargarActividad(planId, actividadId)
  const plan = cargar.data
  const actividad =  plan?.actividades?.find(a => a.id == actividadId)

  console.log("Actividad", cargar)

  const getLabels = () => {
    const labels = [] as string[]
    const first = actividad!.historial.length && moment(actividad!.historial[0].fecha)
    const last = actividad!.historial.length ? moment(actividad!.historial[actividad!.historial.length-1].fecha) : null
    const inicio = moment(actividad!.inicio).subtract(1, 'days')
    const fin = moment(actividad!.fin)
    const conclusion = actividad!.conclusion ? moment(actividad!.conclusion) : null
    const hoy = moment()

    const startDate = (!first || inicio.isBefore(first)) ? inicio :  first
    let endDate = fin;
    if(conclusion && fin.isBefore(conclusion)){
      endDate = conclusion
    }
    if(last && endDate.isBefore(last)){
      endDate = last
    }
    if(endDate.isBefore(hoy)){
      endDate = hoy
    }

    while(startDate.isSameOrBefore(endDate)){
      labels.push(startDate.format('Do MMM'))
      startDate.add(1, 'days')
    }

    return labels
  }

  const getData = () =>{
    const data = [] as number[]
    const first = actividad!.historial.length ? moment(actividad!.historial[0].fecha) : null
    const last = actividad!.historial.length ? moment(actividad!.historial[actividad!.historial.length-1].fecha) : null
    const inicio = moment(actividad!.inicio).subtract(1, 'days')
    const fin = moment(actividad!.fin)
    const conclusion = actividad!.conclusion ? moment(actividad!.conclusion) : null
    const hoy = moment()

    console.log(actividad!.conclusion)

    let startDate = ((!first || inicio.isBefore(first)) ? inicio :  first).clone()
    let endDate = last;
    if(conclusion){
      if(!endDate || endDate.isBefore(conclusion)){
        endDate = conclusion
      }
    }
    else {
      if(!endDate || endDate.isBefore(hoy)){
        console.log(hoy)
        endDate = hoy
      }
    }

    console.log(actividad)

    let ultimoAvance = 0
    while(startDate.isSameOrBefore(endDate)){
      const entries = actividad!.historial.filter(h=>h.fecha == startDate.format('YYYY-MM-DD'))
      const avance = entries[entries.length-1]
      ultimoAvance = avance ? avance.actual : ultimoAvance
      data.push(ultimoAvance)
      startDate = startDate.add(1, 'days').clone()
    }
    return data
  }

  const getIdealData = () => {
    const data = [] as number[]
    const first = actividad!.historial.length ? moment(actividad!.historial[0].fecha) : null
    const last = actividad!.historial.length ? moment(actividad!.historial[actividad!.historial.length-1].fecha) : null
    const inicio = moment(actividad!.inicio).subtract(1, 'days')
    const fin = moment(actividad!.fin)
    const conclusion = actividad!.conclusion ? moment(actividad!.conclusion) : null
    const hoy = moment()

    
    const duration = moment.duration(fin.diff(inicio)).asDays()
    let date = ((!first || inicio.isBefore(first)) ? inicio :  first).clone()
    let endDate = fin;
    if(conclusion && fin.isBefore(conclusion)){
      endDate = conclusion
    }
    if(last && endDate.isBefore(last)){
      endDate = last
    }
    if(endDate.isBefore(hoy)){
      endDate = hoy
    }

    while(date.isSameOrBefore(endDate)){
      const day = moment.duration(date.diff(inicio)).asDays()
      data.push(Math.min(100, Math.max(0, Math.round(10000*day/duration)/100)))
      date = date.add(1, 'days').clone()
    }

    return data
  }
  
  const data = useMemo(()=> {
    if (!actividad) return
    const labels = getLabels()

    return {
    labels: labels,
    datasets: [
        {
          label: 'Avance real',
          data: getData(),
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Avance Esperado',
          data: getIdealData(),
          borderDash: [5, 5],
          fill: false,
          backgroundColor: 'rgb(53, 54, 95)',
          borderColor: 'rgba(53, 54, 95, 0.2)',
        }
      ],
    }
  }, [actividad]);

  return <>
    <h1 style={{fontSize: "1.5rem"}}>Actividad</h1>
    <Row>
      <Col className='mb-3' lg={6}>
        <Card style={{height: '100%'}}>
          <Card.Header>Información</Card.Header>
          <Card.Body>
            <dl className="form-row">
              <dt className="col-sm-3">Nombre</dt>
              <dd className="col-sm-9">{cargar.isFetching ? <Skeleton /> : actividad?.nombre}</dd>
              
              <dt className="col-sm-3">Fecha de inicio</dt>
              <dd className="col-sm-9">{cargar.isFetching ? <Skeleton /> : `${moment(actividad?.inicio).format('L')}`}</dd>

              <dt className="col-sm-3">Fecha de conclusión</dt>
              <dd className="col-sm-9">{`${moment(actividad?.fin).format('L')} (${moment(actividad?.fin).fromNow()})`}</dd>

              <dt className="col-sm-3">Avanve</dt>
              <dd className="col-sm-9">{actividad?.avance}%</dd>

              <dt className="col-sm-3">Avance esperado</dt>
              <dd className="col-sm-9">{actividad?.avanceEsperado}%</dd>
            </dl>
          </Card.Body>
        </Card>
      </Col>
      <Col className="mb-3" lg={6}>
        <Card style={{height: '100%'}}>
          <Card.Header>Progreso</Card.Header>
          <Card.Body>
            {data && <LineChart data={data} options={options} type="line" />}
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Card>
      <Card.Header>Historial de avance</Card.Header>
      <Card.Body>
        <ProtectedContent
          authorize={(user) => !!plan && PlanPolicy.registrarAvance(user, plan)}
        >
          <div className="d-flex mb-2">
            <Button className="ml-auto" onClick={()=>{
              showAvanceForm(true)
            }}
            ><FaPlus /></Button>
          </div>
        </ProtectedContent>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th style={{width: 110}}>Avance</th>
              <th>Observaciones</th>
              <th style={{width: 1}}></th>
            </tr>
          </thead>
          <tbody>
            {actividad?.historial.map((avance, index) => {
              return <tr key={avance.id}>
                <th scope="row">{index + 1}</th>
                <td className="text-nowrap">{moment(avance.fecha).format("L")}</td>
                <td>
                  <div className="text-center">
                    <div>
                      {`${avance.actual}%/${avance.esperado}%`}
                    </div>
                    <div className={avance.actual >= avance.esperado ? "bg-success" : moment().isBefore(moment(actividad.fin)) ? "bg-warning" : "bg-danger"}
                      style={{width: `${avance.actual}%`, overflow: 'hidden', position: 'relative', top: '-1.5rem'}}>
                      <div className="text-white" style={{width: 110}}>
                        {`${avance.actual}%/${avance.esperado}%`}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{avance.observaciones}</td>
                <td><HistorialRowOptions avance={avance}/></td>
              </tr>
            })}
          </tbody>
        </Table>
        <ProtectedContent
          authorize={(user) => !!plan && PlanPolicy.registrarAvance(user, plan)}
        >
          <div className="d-flex mb-2">
            <Button className="ml-auto" onClick={()=>{
              showAvanceForm(true)
            }}
            ><FaPlus /></Button>
          </div>
        </ProtectedContent>
        {actividad && <AvanceForm actividad={actividad} show={avanceFormVisible} onHide={()=>showAvanceForm(false)} />}
      </Card.Body>
    </Card>
  </>
}