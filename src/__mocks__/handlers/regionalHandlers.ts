import { rest } from 'msw'
import { apiEndpoint } from '../../configs/app'

const route = (path: string)=>{
  return apiEndpoint.trimEnd() + path
}

export const regionalHandlers = [
  rest.get(route('regionales'), (req, res, ctx) => {
    const regionales = [
      {
        id: 1,
        nombre: "La Paz",
      },
      {
        id: 3,
        nombre: "Santa Cruz",
      }
    ]//regionalFactory.buildList(10)
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(regionales)
    )
  })
]