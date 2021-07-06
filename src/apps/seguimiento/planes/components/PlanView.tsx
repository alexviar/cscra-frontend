import React, {useEffect, useState} from 'react'
import { Button, Card, Col, Form, Table } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import { useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { PlanService, Plan } from '../services'
import { useCargarPlan } from '../queries'
import { ActividadRowOptions } from './ActividadRowOptions'

export const PlanView = ()=>{
  const { planId: id } = useParams<{
    planId: string
  }>()

  const cargar = useCargarPlan(parseInt(id))

  const plan = cargar.data
  console.log(cargar, plan)

  return <>
    <h1 style={{fontSize: "1.75rem"}}>Plan</h1>
    <Card className="mb-2">
      <Card.Header>Información</Card.Header>
      <Card.Body>
        <dl className="form-row">
          <dt className="col-sm-3">Objetivo general</dt>
          <dd className="col-sm-9">{cargar.isFetching ? <Skeleton /> : plan?.objetivoGeneral }</dd>
          <dt className="col-sm-3">Avance</dt>
          <dd className="col-sm-9">{cargar.isFetching ? <Skeleton /> : `${plan?.avance}/${plan?.actividades.length}`}</dd>
          <dt className="col-sm-3">Avance esperado</dt>
          <dd className="col-sm-9">{cargar.isFetching ? <Skeleton /> : `${plan?.avanceEsperado}/${plan?.actividades.length}`}</dd>
        </dl>
      </Card.Body>
    </Card>
    <Card className="mb-2">
      <Card.Header>Actividades</Card.Header>
      <Card.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Indicadores</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Avance</th>
              <th style={{width: 1}}></th>
            </tr>
          </thead>
          <tbody>
            {plan?.actividades.map((actividad, index) => {
              return <tr key={actividad.id}>
                <th scope="row">{index + 1}</th>
                <td>{actividad.nombre}</td>
                <td>{actividad.indicadores}</td>
                <td className="text-nowrap">{actividad.inicio}</td>
                <td className="text-nowrap">{actividad.fin}</td>
                <td>{actividad.estado == 1 ? 'Pendiente' : actividad.estado == 2 ? 'En progreso' : actividad.estado == 3 ? 'En espera' : actividad.estado == 4 ? 'Concluido' : ''}</td>
                <td >
                  <div className="text-center">
                    <div>
                      {`${actividad.avance}%/${actividad.avanceEsperado}%`}
                    </div>
                    <div className={actividad.avance >= actividad.avanceEsperado ? "bg-success" : moment().isBefore(moment(actividad.fin)) ? "bg-warning" : "bg-danger"}
                      style={{width: `${actividad.avance}%`, overflow: 'hidden', position: 'relative', top: '-1.5rem'}}>
                      <div className="text-white" style={{width: 110}}>
                        {`${actividad.avance}%/${actividad.avanceEsperado}%`}
                      </div>
                    </div>
                  </div>              
                </td>
                <td><ActividadRowOptions actividad={actividad}/></td>
              </tr>
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  </>
}