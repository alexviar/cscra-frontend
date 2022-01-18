import { rest } from 'msw'
import { authRoute, apiRoute } from '../routes'

const admin = {
  id:1,
  ciRaiz:0,
  ciComplemento:null,
  apellidoPaterno:null,
  apellidoMaterno:null,
  nombres:"",
  username:"admin",
  estado:1,
  regionalId:1,
  createdAt:"2021-05-25",
  updatedAt:"2021-05-25",
  nombreCompleto:"",
  ci:"0",
  estadoText:"Activo",
  allPermissions:[],
  roles:[
    {
      id:1,
      name:"super user",
      description:null,
      guardName:"sanctum",
      createdAt:"2021-05-25T17:23:24.000000Z",
      updatedAt:"2021-05-25T17:23:24.000000Z",
      pivot: { 
        modelId: 1,
        roleId: 1,
        modelType: "App\\Models\\User"
      },
      permissions: []
    }
  ],
  permissions: []
}

let user: any = admin
export const authHandlers = [
  rest.post(authRoute('login'), (req, res, ctx) => {
    user = admin
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(user)
    )
  }),
  rest.post(authRoute('logout'), (req, res, ctx) => {
    user = null
    return res(
      // Respond with a 200 status code
      ctx.status(200)
    )
  }),
  rest.get(apiRoute('user'), (req, res, ctx) => {
    return user ? res(ctx.json(user)) : res(ctx.status(401))
  }),
  rest.get(authRoute("sanctum/csrf-cookie"), (req, res, ctx) => {
    return res(ctx.status(200))
  })
]