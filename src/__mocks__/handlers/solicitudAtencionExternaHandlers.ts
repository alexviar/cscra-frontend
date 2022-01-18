import { rest } from 'msw'
import { solicitudesAtencionExternaFactory } from '../factories'
import { apiRoute } from '../routes'
import Qs from 'qs'

export const solicitudAtencionExternaHandlers = [
  rest.get(apiRoute("solicitudes-atencion-externa"), (req, res, ctx) => {
    const {filter, page} = Qs.parse(req.url.search.substring(1)) as any
    
    if(!solicitudesAtencionExternaFactory.data.length) solicitudesAtencionExternaFactory.buildList(100)
    let { data } = solicitudesAtencionExternaFactory
  
    const total = data.length
  
    const offset = page.current*page.size
    data = data.slice(offset - page.size, offset)
  
    return res(ctx.json({
      meta: {
        total: total,
        nextPage: offset >= total ? undefined : parseInt(page.current) + 1
      },
      records: data
    }))
  })
]