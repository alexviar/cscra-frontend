import { rest } from 'msw'
import { planFactory, actividadFactory, avanceFactory } from '../../apps/seguimiento/planes/__factories__'
import { apiEndpoint } from '../../configs/app'
import moment from 'moment'

const route = (path: string)=>{
  return apiEndpoint.trimEnd() + path
}

const planes = planFactory.buildList(1)
export const planHandlers = [
  rest.get(route('planes'), (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        meta: { total: planes.length},
        records: planes          
      })
    )
  }),

  rest.get(route('planes/:planId/actividades/:actividadId'), (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(planes.find(p=>p.id == req.params.planId)?.actividades.find(a=>a.id == req.params.actividadId))
    )
  }),

  rest.post(route('planes/:planId/actividades/:actividadId/registrar-avance'), (req, res, ctx) => {
    if(req.body){
      const avance = (req.body as any).get("avance")
      const observaciones = (req.body as any).get("observaciones")

      const plan = planes.find(p=>p.id == req.params.planId)
      const actividad = plan?.actividades.find(a=>a.id == req.params.actividadId)
      if(!actividad){
        return res(
          ctx.status(404)
        )
      }
      
      const inicio = moment(actividad.inicio)
      const fin = moment(actividad.fin)
      const hoy = moment().startOf('day')
      const avanceEsperado= Math.round(Math.max(0, Math.min(1, moment.duration(hoy.diff(inicio)).asDays()/moment.duration(fin.diff(inicio)).asDays()))*10000)/100

      const entry = avanceFactory.build({
        fecha: moment().format("YYYY-MM-DD"),
        actual: avance,
        esperado: avanceEsperado,
        observaciones: `${avance} + ${observaciones}`
      })

      actividad.historial.push(entry)


      return res(
        // Respond with a 200 status code
        ctx.status(200),
        ctx.json(entry)
      )
    }
    
    return res(
      ctx.status(400)
    )
  }),

  rest.post(route('planes'), (req, res, ctx) => {
    if(req.body){
      const plan = planFactory.build({
        objetivoGeneral: (req.body as Record<string, any>).objetivo_general,
        concluido: false
      }, {
        associations: {
          regionalId: (req.body as Record<string, any>).regional_id,
          areaId: (req.body as Record<string, any>).area_id,
          actividades:(req.body as Record<string, any>).actividades.map((a: any)=>{
            const inicio = moment(a.inicio)
            const fin = moment(a.fin)
            const hoy = moment().startOf('day')
            return actividadFactory.build({
              ...a,
              avance: 0,
              avanceEsperado: Math.max(0, Math.min(1, moment.duration(hoy.diff(inicio)).asDays()/moment.duration(fin.diff(inicio)).asDays()))*100,
              estado: 1
            }, {
              associations: {
                historial: []
              }
            })
          })
        }
      })
      planes.push(plan)
      return res(
        ctx.status(200),
        ctx.json({
          ...plan,
          actividades: plan.actividades.map((a:any)=>{
            const inicio = moment(a.inicio)
            const fin = moment(a.fin)
            const hoy = moment().startOf('day')
            return {
              ...a,
              avance: 0,
              avanceEsperado: Math.max(0, Math.min(1, moment.duration(hoy.diff(inicio)).asDays()/moment.duration(fin.diff(inicio)).asDays()))*100
            }
          })
        })
      )
    }
    return res(
      ctx.status(400)
    )
  }),
  
  rest.get('/user', (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = sessionStorage.getItem('is-authenticated')
    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        }),
      )
    }
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
      }),
    )
  }),
]