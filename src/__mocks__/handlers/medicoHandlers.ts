import { rest } from 'msw'
import { medicosFactory } from '../factories'
import { apiRoute } from '../routes'
import Qs from 'qs'

export const medicoHandlers = [
  rest.get(apiRoute("medicos"), (req, res, ctx) => {
    const {filter, page} = Qs.parse(req.url.search.substring(1)) as any
    
    if(!medicosFactory.data.length) medicosFactory.buildList(100)
    let { data } = medicosFactory
  
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
  }),
  
  rest.get(apiRoute("medicos/:id"), async (req, res, ctx) => {
    
    if(!medicosFactory.data.length) medicosFactory.buildList(100)
    let { data } = medicosFactory
  
    const proveedor = data.find(p => p.id == req.params.id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return proveedor ? res(ctx.json(proveedor)) : res(ctx.status(404))
  })
]