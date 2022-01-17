import { PropsWithChildren } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor, within } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import { QueryClientProvider, QueryClient } from 'react-query';
import { MedicosTypeahead } from "./MedicosTypeahead"
import { medicosFactory } from '../../../../__mocks__/factories';
import { apiRoute } from '../../../../__mocks__/routes';
import { server, waitForRequest } from '../../../../__mocks__/server';

const Wrapper = ({children}: PropsWithChildren<{}>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 0 },
      mutations: { retry: 0 }
    }
  })

  return <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
}

test("Cargar datos", async ()=>{
  const component = render(<MedicosTypeahead
    id="test"
  />, {
    wrapper: Wrapper
  })

  const combobox = await component.findByRole("combobox")

  let pendingRequest, request

  // pendingRequest = waitForRequest("get", apiRoute("medicos"))
  await waitFor(()=>fireEvent.change(combobox, {
    target: {
      value: "Mar"
    }
  }))
  // request = await pendingRequest

  await component.findByText("Buscando...")  
  await component.findByText("No se encontraron resultados")  

  const medicos = medicosFactory.buildList(30)  

  // pendingRequest = waitForRequest("get", apiRoute("medicos"))
  await waitFor(()=>fireEvent.change(combobox, {
    target: {
      value: "Marc"
    }
  }))
  await component.findByText("Buscando...")
  await component.findByRole("status")
  // request = await pendingRequest

  let loadMore = await component.findByText("Cargar más...")
  await waitFor(()=>fireEvent.click(loadMore))

  await component.findByRole("status")
  loadMore = await component.findByText("Cargar más...")
  await waitFor(()=>fireEvent.click(loadMore))

  await component.findByRole("status")
  loadMore = await component.findByText("Cargar más...")



  // const dropdownMenu = await component.findByRole("listbox")

  // console.log(prettyDOM(dropdownMenu))
  // component.debug()
})