import { rest } from 'msw'
import { planFactory } from '../../apps/seguimiento/planes/__factories__'
import { apiEndpoint } from '../../configs/app'

const route = (path: string)=>{
  return apiEndpoint.trimEnd() + path
}

export const planHandlers = [
  rest.get(route('planes'), (req, res, ctx) => {
    const planes = planFactory.buildList(10)
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        meta: { total: planes.length},
        records: planes          
      })
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