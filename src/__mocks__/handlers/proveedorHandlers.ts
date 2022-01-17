import { rest } from 'msw'
import { proveedoresFactory } from '../factories'
import { apiRoute } from '../routes'
import Qs from 'qs'

export const proveedorHandlers = [
  rest.get(apiRoute("proveedores"), (req, res, ctx) => {
    const {filter, page} = Qs.parse(req.url.search.substring(1)) as any
    
    if(!proveedoresFactory.data.length) proveedoresFactory.buildList(100)
    let { data } = proveedoresFactory
  
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