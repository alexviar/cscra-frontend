import { useMemo } from 'react'
import { AxiosResponse, AxiosError } from 'axios';
import { Page, PaginatedResponse } from '../../../../commons/services'
import { QueryKey, UseMutationOptions, UseQueryOptions, UseQueryResult, useMutation, useQuery, useQueryClient } from 'react-query'
import { Avance, Actividad, Plan, PlanService, PlanFilter } from '../services'

export type { PlanFilter }

let queryKey: QueryKey;

export const useBuscarPlanes = (filter: PlanFilter, page: Page) => {
  queryKey = ["planes.buscar", filter, page]
  return useQuery(queryKey, ()=>{
    return PlanService.buscar(filter, page)
  }, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useCargarPlan = (id: number, options?: UseQueryOptions<AxiosResponse<Plan>, AxiosError, Plan>) => {
  const queryClient = useQueryClient()
  const cargarQueryKey = ["planes.cargar", id]
  const queryState = queryClient.getQueryState(cargarQueryKey)
  if(!queryState || queryState?.status === 'idle'){
    const planesQueryData = queryClient.getQueryData<any>(queryKey)
    const plan = planesQueryData?.data.records?.find((p: Plan) => p.id === id)
    console.log("Cargar plan", plan)
    if(plan) {
      queryClient.setQueryData(cargarQueryKey, {
        data: plan
      })
    }
  }
  const cargar = useQuery(cargarQueryKey, ()=>{
    return PlanService.cargar(id)
  }, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) => data.data,
    ...options
  })
  console.log("Cargar plan", cargar)
  return cargar
}

export const useCargarActividad = (planId: number, actividadId: number, options?: UseQueryOptions<AxiosResponse<Plan>, AxiosError, Actividad|null>) => {
  // const queryClient = useQueryClient()
  // const cargarQueryKey = ["planes.cargar", planId]
  // if(queryClient.getQueryState(cargarQueryKey)?.status === 'idle'){
  //   const planesQueryData = queryClient.getQueryData<any>(queryKey)
  //   const plan = planesQueryData?.data.records?.find((p: Plan) => p.id === planId)
  //   if(plan) {
  //     queryClient.setQueryData(cargarQueryKey, {
  //       data: plan
  //     })
  //   }
  // }
  // const cargar = useQuery(cargarQueryKey, ()=>{
  //   return PlanService.cargar(planId)
  // }, {
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  //   select: (data) => data.data.actividades?.find(a => a.id == actividadId) || null,
  //   ...options,
  // })
  
  const cargar = useCargarPlan(planId, {
    //@ts-ignore
    select: (data) => data.data.actividades?.find(a => a.id == actividadId) || null,
    //@ts-ignore
    ...options
  })
  return cargar as UseQueryResult<Actividad, AxiosError>
}

export const useRegistrarAvance = (options?: UseMutationOptions<AxiosResponse<Avance>, AxiosError, {
  params: {
    planId: number
    actividadId: number
  }
  data: {
    avance: number
    observaciones: string
    informe: File
  }
}>) => {
  const queryClient = useQueryClient()
  return useMutation((vars)=>{
    const {params:{planId, actividadId}, data} = vars
    return PlanService.registrarAvance(planId, actividadId, data)
  }, {
    ...options,
    onSuccess: (data, vars, ctx)=>{
      const { data: avance } = data, { params: { planId, actividadId } } = vars
      options?.onSuccess && options.onSuccess(data, vars, ctx)
      const updatePlan = (plan: Plan, avance: Avance) => {
        const actividades = plan.actividades.map(a => {
          return a.id === actividadId ? {
            ...a,
            avance: avance.actual,
            avanceEsperado: avance.esperado,
            historial: [
              ...a.historial,
              avance
            ]
          } : a
        })
        return {
          ...oldData.data,
          avance: actividades.filter(a => a.avance == 100).length,
          avanceEsperado: actividades.filter(a => a.avanceEsperado == 100).length,
          actividades
        }
      }

      const oldData = queryClient.getQueryData(["planes.cargar", planId]) as AxiosResponse<Plan>
      if(oldData) {
        queryClient.setQueryData(["planes.cargar", planId], {
          ...oldData,
          data: updatePlan(oldData.data, avance)
        })
      }
      else {
        queryClient.setQueryData(queryKey, (oldData?: AxiosResponse<PaginatedResponse<Plan>>) => {
          const records = oldData!.data.records.map(p => {
            if(p.id === planId){
              return updatePlan(p, avance)
            }
            return p
          })
          return {
            ...oldData!,
            data: {
              ...oldData!.data,
              records
            }
          }
        })
      }
    }
  })
}