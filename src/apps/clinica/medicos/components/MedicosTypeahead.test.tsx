import { PropsWithChildren } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
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

  pendingRequest = waitForRequest("get", apiRoute("medicos"))
  await waitFor(()=>fireEvent.change(combobox, {
    target: {
      value: "Mar"
    }
  }))

  let options, loadMore: HTMLElement, loadingIndicator: HTMLElement

  loadingIndicator = await component.findByRole("status")
  await waitFor(()=>expect(loadingIndicator).not.toBeInTheDocument())
  options = await component.findAllByRole("option")

  expect(options.length).toBe(11)
  loadMore = await component.findByText("Cargar más...")
  await waitFor(()=>fireEvent.click(loadMore))
  loadingIndicator = await component.findByRole("status")
  await waitFor(()=>expect(loadingIndicator).not.toBeInTheDocument())
  options = await component.findAllByRole("option")

  expect(options.length).toBe(21)
  loadMore = await component.findByText("Cargar más...")
  await waitFor(()=>fireEvent.click(loadMore))
  loadingIndicator = await component.findByRole("status")
  await waitFor(()=>expect(loadingIndicator).not.toBeInTheDocument())
  options = await component.findAllByRole("option")

  expect(options.length).toBe(31)
  loadMore = await component.findByText("Cargar más...")
  fireEvent.click(loadMore)
  loadingIndicator = await component.findByRole("status")
  await waitFor(()=>expect(loadingIndicator).not.toBeInTheDocument())
  options = await component.findAllByRole("option")

  expect(options.length).toBe(41)
  loadMore = await component.findByText("Cargar más...")
  await waitFor(()=>fireEvent.click(loadMore))
  loadingIndicator = await component.findByRole("status")
  // await waitFor(()=>expect(loadingIndicator).not.toBeInTheDocument())
  // options = await component.findAllByRole("option")




  // expect(options.length).toBe(100)

  // pendingRequest = waitForRequest("get", apiRoute("medicos"))
  // await waitFor(()=>fireEvent.change(combobox, {
  //   target: {
  //     value: "Marc"
  //   }
  // }))
}, 60000)