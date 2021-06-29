import React, {useMemo, useState} from 'react'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import moment from 'moment'
import 'moment/locale/es'
import { PlanService, Actividad } from '../services'
// import { HistorialRowOptions } from './HistorialRowOptions'
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['11 Jun', '2', '3', '4', '5', '2', '3', '4', '5', '2', '3', '4', '5', '2', '3', '4', '5', '2', '3', '4', '5', '2', '3', '4', '5', '2', '3', '4', '5', '2', '3', '4', '5', '6'],
  datasets: [
    {
      label: 'Avance real',
      data: [12, 19, 3, 5, 2, 3],
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    },
    {
      label: 'Avance Esperado',
      data: [0, 20, 40, 60, 80, 100],
      fill: false,
      backgroundColor: 'rgb(53, 54, 95)',
      borderColor: 'rgba(53, 54, 95, 0.2)',
    }
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export const ActividadView = ()=>{
  const location = useLocation<{actividad?: Actividad}>()
  const { state } = location
  const { planId, actividadId } = useParams<{
    planId: string
    actividadId: string
  }>()

  const cargar = useQuery(["planes.cargar", planId], ()=>{
    return PlanService.cargar(parseInt(planId))
  }, {
    enabled: !state?.actividad,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const plan = cargar.data?.data
  const actividad = state?.actividad || plan?.actividades?.find(a => a.id == parseInt(actividadId))
  

  const data = useMemo(()=> {
    if (!actividad) return

    const labels = [] as string[]
    const inicio = moment(actividad.inicio)
    const fin = moment(actividad.fin).add(1, 'days')

    while(inicio.isSameOrBefore(fin)){
      labels.push(inicio.format('Do MMM'))
      inicio.add(1, 'days')
    }

    return {
    labels: labels,
    datasets: [
        {
          label: 'Avance real',
          data: [0, 12, 19, 3, 5, 10, 13],
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Avance Esperado',
          data: labels.map((_,index)=>{
            return (index/(labels.length-1))*100
          }),
          fill: false,
          backgroundColor: 'rgb(53, 54, 95)',
          borderColor: 'rgba(53, 54, 95, 0.2)',
        }
      ],
    }
  }, [actividad]);

  console.log(data)

  return <>
    <h1 style={{fontSize: "1.5rem"}}>Actividad</h1>
    <Row className="mb-3">
      <Col>
        <Card style={{height: '100%'}}>
          <Card.Header>Información</Card.Header>
          <Card.Body>
            <dl className="form-row">
              <dt className="col-sm-3">Nombre</dt>
              <dd className="col-sm-9">{actividad?.nombre}</dd>
              
              <dt className="col-sm-3">Fecha de inicio</dt>
              <dd className="col-sm-9">{`${moment(actividad?.inicio).format('L')}`}</dd>

              <dt className="col-sm-3">Fecha de conclusión</dt>
              <dd className="col-sm-9">{`${moment(actividad?.fin).format('L')} (${moment(actividad?.fin).locale('es').fromNow()})`}</dd>

              <dt className="col-sm-3">Avanve</dt>
              <dd className="col-sm-9">{actividad?.avance}%</dd>

              <dt className="col-sm-3">Avance esperado</dt>
              <dd className="col-sm-9">{actividad?.avanceEsperado}%</dd>
            </dl>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card style={{height: '100%'}}>
          <Card.Header>Gráfico</Card.Header>
          <Card.Body>
            {data && <Line data={data} options={options} type="line" />}
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Card>
      <Card.Header>Historial de avance</Card.Header>
      <Card.Body>
        <div className="d-flex mb-2">
          <Button className="ml-auto" as={Link} to={{
            pathname: `${location.pathname}/registrar-avance`,
            state: {
              background: location
            }
          }}><FaPlus /></Button>
        </div>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th style={{width: 110}}>Avance</th>
              <th>Observaciones</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {actividad?.historial.map((avance, index) => {
              return <tr key={avance.id}>
                <th scope="row">{index + 1}</th>
                <td className="text-nowrap">{moment(avance.fecha).format("L")}</td>
                <td >
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
                {/* <td><ActividadRowOptions actividad={actividad}/></td> */}
              </tr>
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  </>
}