import { rest } from 'msw'
import { areaFactory } from '../../apps/seguimiento/planes/__factories__'
import { apiEndpoint } from '../../configs/app'

const route = (path: string)=>{
  return apiEndpoint.trimEnd() + path
}

export const areaHandlers = [
  rest.get(route('areas'), (req, res, ctx) => {
    const areas = [
      {
        id: 1,
        nombre: "Control de empresas"
      },
      {
        id: 2,
        nombre: "Afiliación"
      },
      {
        id: 3,
        nombre: "Sistemas"
      },
      {
        id: 4,
        nombre: "Contabilidad"
      },
      {
        id: 5,
        nombre: "Facturación"
      }
    ]//areaFactory.buildList(10)
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(areas)
    )
  })
]