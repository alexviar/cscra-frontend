import { rest } from 'msw'
import { listaMoraFactory } from '../../apps/clinica/mora/services/__factories__/ListaMoraFactory'
import { apiEndpoint } from '../../configs/app'
import Qs from 'qs'

const route = (path: string)=>{
  return apiEndpoint.trimEnd() + path
}

export const listaMoraHandlers = [
  rest.get(route("lista-mora"), (req, res, ctx) => {
    let data = listaMoraFactory.data
    const {filter, page} = Qs.parse(req.url.search.substring(1)) as any
  
    if(filter?.numero_patronal){
      data = data.filter(d => d.numeroPatronal == filter.numero_patronal)
    }
    if(filter?.nombre){
      data = data.filter(d => d.nombre == filter.nombre)
    }
  
    const total = data.length
  
    const offset = page.current*page.size
    data = data.slice(offset - page.size, offset)
  
    return res(ctx.json({
      meta: {
        total: total,
      },
      records: data
    }))
  })
]