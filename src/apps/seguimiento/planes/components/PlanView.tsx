import React, {useEffect, useState} from 'react'
import { Button, Col, Form, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import moment from 'moment'
import { PlanService, Plan } from '../services'
import { ActividadRowOptions } from './ActividadRowOptions'

export const PlanView = ()=>{
  const { state } = useLocation<{plan?: Plan}>()
  const { planId: id } = useParams<{
    planId: string
  }>()

  const cargar = useQuery(["planes.cargar", id], ()=>{
    return PlanService.cargar(parseInt(id))
  }, {
    enabled: !state?.plan,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const plan = state?.plan || cargar.data?.data 
  console.log(plan)

  return <>
    <h1 style={{fontSize: "1.75rem"}}>Plan</h1>
    <Table>
      <tbody>
        <tr>
          <th scope="row">Objetivo general</th>
          <td>: {plan?.objetivoGeneral}</td>
        </tr>
        <tr>
          <th scope="row">Avance</th>
          <td>: {plan?.actividades.filter(actividad=>actividad.avance == 100).length}/{plan?.actividades.length}</td>
        </tr>
        <tr>
          <th scope="row">Avance esperado</th>
          <td>: {plan?.actividades.filter(actividad=>moment(actividad.fin).isAfter(moment())).length}/{plan?.actividades.length}</td>
        </tr>
      </tbody>
    </Table>
    <h2 style={{fontSize: "1.25rem"}}>Actividades</h2>
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
          <th></th>
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
                <div className="bg-primary" style={{width: `${actividad.avance}%`, overflow: 'hidden', position: 'relative', top: '-1.5rem'}}>
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
  </>
}