import { rest } from 'msw'
import { authEndpoint } from '../../configs/app'

const route = (path: string)=>{
  return authEndpoint.trimEnd() + path
}

console.log(route('login'))

export const authHandlers = [
  rest.post(route('login'), (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        id: 1,
        username: 'admin',
        roles: [{
          id: 1,
          name: 'super user'
        }]
      })
    )
  })
]