import { PropsWithChildren } from 'react'
import Qs from 'qs'
import { rest } from 'msw'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor, within } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import ListaMoraIndex from "./ListaMoraIndex";
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import AuthModuleReducer from '../../../../commons/auth/reducers';
import { QueryClientProvider, QueryClient } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { listaMoraFactory } from '../services/__factories__/ListaMoraFactory';
import { QueryProgressModal } from '../../../../commons/components';
import { createModalReducer } from '../../../../commons/reusable-modal';
import { server, waitForRequest } from '../../../../__mocks__/server';
import { apiRoute } from '../../../../__mocks__/routes';
import { Permisos } from '../policies'

const Wrapper = ({children}: PropsWithChildren<{}>) => {
  const preloadedState = {}
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 0 },
      mutations: { retry: 0 }
    }
  })

  return <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      <Provider store={createStore(
        combineReducers({
          auth: AuthModuleReducer,
          modals: combineReducers({
            queryLoader: createModalReducer("queryLoader")
          }),
        }),
        preloadedState
      )}>
        <QueryProgressModal />
        {children}
      </Provider>
    </QueryClientProvider>
  </MemoryRouter>
}

test('Cargar la lista de mora', async () => {
  const component = render(<ListaMoraIndex />, {
    wrapper: Wrapper
  })

  await component.findByText("Cargando")
  await component.findByText("No se encontraron resultados")
  await component.findByText("Se encontraron 0 resultados")

  const items = listaMoraFactory.buildList(100)
  const refetch = component.getByRole("button", { "name": "Actualizar" })

  fireEvent.click(refetch)

  await component.findByText("Cargando")
  await waitFor(() => expect(component.queryByText("Cargando")).toBeNull())
  await component.findByText("Se encontraron 100 resultados")

  let tbody = component.getAllByRole("rowgroup")[1]
  expect(within(tbody).getAllByRole("row").length).toBe(10)
})

test("Filtros", async () => {
  const component = render(<ListaMoraIndex />, {
    wrapper: Wrapper
  })

  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = `
.collapse:not(.show) {
    display: none;
}
`
  component.container.append(style)

  const toggle = await component.findByRole("button", { name: "Mostrar formulario de busqueda" })
  const searchFormContainer = await component.findByTestId("filterFormContainer")
  expect(searchFormContainer).not.toBeVisible()
  fireEvent.click(toggle)
  await waitFor(() => expect(searchFormContainer).toBeVisible())

  const btnBuscar = within(searchFormContainer).getByText("Aplicar")
  const btnLimpiar = within(searchFormContainer).getByText("Limpiar")

  const inputNumeroPatronal = within(searchFormContainer).getByLabelText("N.º Patronal")
  const inputNombre = within(searchFormContainer).getByLabelText("Nombre")
  
  let pendingRequest, req, queryString;
  
  //Filtro por numero patronal
  pendingRequest = waitForRequest("get", apiRoute("lista-mora"))
  fireEvent.change(inputNumeroPatronal, {
    target: {
      value: "123-45678"
    }
  })
  await waitFor(()=>fireEvent.click(btnBuscar))
  req = await pendingRequest
  queryString = Qs.parse(req.url.search.substring(1)) as any
  expect(queryString.filter?.numero_patronal).toEqual("123-45678")
  fireEvent.click(btnLimpiar)

  //Filtro por nombre
  pendingRequest = waitForRequest("get", apiRoute("lista-mora"))
  fireEvent.change(inputNombre, {
    target: {
      value: "Solvi Vega"
    }
  })
  await waitFor(()=>fireEvent.click(btnBuscar))
  req = await pendingRequest
  queryString = Qs.parse(req.url.search.substring(1)) as any
  expect(queryString.filter?.nombre).toEqual("Solvi Vega")
  fireEvent.click(btnLimpiar)

  fireEvent.click(toggle)
  await waitFor(() => expect(searchFormContainer).not.toBeVisible())
})

test("Usuario regional", async () =>{
  server.use(rest.get(apiRoute("user"), (req, res, ctx) =>{
    return res(ctx.json({
      id: 2,
      ciRaiz: 0,
      ciComplemento:null,
      apellidoPaterno:null,
      apellidoMaterno:null,
      nombres:"",
      username:"someuser",
      estado:1,
      regionalId:1,
      createdAt:"2021-05-25",
      updatedAt:"2021-05-25",
      nombreCompleto:"",
      ci:"0",
      estadoText:"Activo",
      allPermissions:[{name: Permisos.VER_LISTA_DE_MORA_REGIONAL}],
      roles:[
        {
          id:1,
          name:"Auxiliares Dpto. admision",
          description:null,
          guardName:"sanctum",
          createdAt:"2021-05-25T17:23:24.000000Z",
          updatedAt:"2021-05-25T17:23:24.000000Z",
          pivot: { 
            modelId: 1,
            roleId: 1,
            modelType: "App\\Models\\User"
          },
          permissions: [{name: Permisos.VER_LISTA_DE_MORA_REGIONAL}]
        }
      ],
      permissions: []
    }))
  }))

  const reqPromise = waitForRequest("get", apiRoute("lista-mora"))

  const component = render(<ListaMoraIndex />, {
    wrapper: Wrapper
  })

  const pendingRequest  = await reqPromise
  
  // console.log("URL", pendingRequest.url.toString())

  expect(Qs.parse(pendingRequest.url.search.substring(1))).toMatchObject({
    filter: {
      regional_id: "1"
    }
  }) 
})


test("Error de red", async () =>{
  server.use(rest.get(apiRoute("lista-mora"), (req, res, ctx) =>{
    return res.networkError("Failed to connect")
  }))

  const component = render(<ListaMoraIndex />, {
    wrapper: Wrapper
  })

  await component.findByText("Cargando")
  await component.findByText("Error de red")
})

test("Navegacion y tamaño de pagina", async () => {

  const component = render(<ListaMoraIndex />, {
    wrapper: Wrapper
  })

  const navigation = await component.findByRole("navigation", {name: "Paginador"})
  const btnGoToPage6 = within(navigation).getByText("6")
  
  let pendingRequest = waitForRequest("get", apiRoute("lista-mora"))
  fireEvent.click(btnGoToPage6)
  let req = await pendingRequest
  expect(Qs.parse(req.url.search.substring(1))).toMatchObject({
    page: {
      current: "6",
    }
  })

  const pageSizeSelector = await component.findByLabelText("Tamaño de pagina")

  pendingRequest = waitForRequest("get", apiRoute("lista-mora"))
  fireEvent.change(pageSizeSelector, {
    target: {
      value: 20
    }
  })
  req  = await pendingRequest
  expect(Qs.parse(req.url.search.substring(1))).toMatchObject({
    page: {
      current: "1",
      size: "20"
    }
  })
})

