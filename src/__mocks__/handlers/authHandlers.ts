import { rest } from 'msw'
import { authEndpoint, apiEndpoint } from '../../configs/app'

const route = (path: string)=>{
  return authEndpoint.trimEnd() + path
}

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

export const authHandlers = [
  rest.post(route('login'), (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(admin)
    )
  }),
  rest.get(apiEndpoint.trimEnd() + 'user', (req, res, ctx) => {
    return res(ctx.json(admin))
  })
]