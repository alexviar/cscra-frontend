import React from 'react'
import  '@testing-library/jest-dom/extend-expect'
import  { render } from '@testing-library/react' 
import ListaMoraIndex from "./ListaMoraIndex";
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { rest } from 'msw'
import AuthModuleReducer from '../../../../commons/auth/reducers';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Permisos } from '../policies';
import { server } from '../../../../__mocks__/server'
import { apiEndpoint } from '../../../../configs/app'

const route = (path: string)=>{
  return apiEndpoint.trimEnd() + path
}

test('No se encontraron resultados.', async ()=>{
  server.use(rest.get(route("lista-mora"), (req, res, ctx) => {
    return res(ctx.json({
      meta: {
        total: 0,
      },
      records: [

      ]}))
  }))

  const preloadedState = {
    auth: {
      user: {
        allPermissions: [
          {id: 0, name: Permisos.VER_LISTA_DE_MORA}
        ],
        roles:[]
      },
      isAuthenticated: false,
    }
  }
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 0, staleTime: Infinity, },
      mutations: { retry: 0 }
    }
  })
  const component = render(
    <QueryClientProvider client={queryClient}>
      <Provider store={createStore(
        combineReducers({
          auth: AuthModuleReducer
        }),
        preloadedState
      )}>
        <ListaMoraIndex />
      </Provider>
    </QueryClientProvider>
  )

  component.getByText("Cargando")
  await component.findByText("No se encontraron resultados")  
})