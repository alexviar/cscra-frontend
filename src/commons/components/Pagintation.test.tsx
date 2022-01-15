import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor, within } from '@testing-library/react'
import { Pagination } from './Pagination'

test("Total = 0", ()=>{
  let component = render(<Pagination
    current={1}
    total={0}
    onChange={()=>{}}
  />)

  expect(component.getByRole("navigation")).toBeEmptyDOMElement()

  
  component.rerender(<Pagination
    current={5}
    total={0}
    onChange={()=>{}}
  />)

  expect(component.getByRole("navigation")).toBeEmptyDOMElement()
})

test("Total = 1", ()=>{
  let component = render(<Pagination
    current={1}
    total={1}
    onChange={()=>{}}
  />)

  const items = component.getAllByRole("listitem")

  expect(items.length).toBe(3)
  expect(component.getByText("Previous").closest("li")?.classList).toContain("disabled")
  expect(component.getByText("1")).toBeInTheDocument()
  expect(component.getByText("Next").closest("li")?.classList).toContain("disabled")
})

test("Total > 9", ()=>{
  let component = render(<Pagination
    current={1}
    total={8}
    onChange={()=>{}}
  />)

  let items = component.getAllByRole("listitem")
  let ellipsis = component.queryAllByText("More")

  expect(items.length).toBe(10)
  expect(ellipsis.length).toBe(0)
  expect(component.getByText("Previous").closest("li")?.classList).toContain("disabled")
  expect(component.getByText("1")).toBeInTheDocument()
  expect(component.getByText("2")).toBeInTheDocument()
  expect(component.getByText("3")).toBeInTheDocument()
  expect(component.getByText("4")).toBeInTheDocument()
  expect(component.getByText("5")).toBeInTheDocument()
  expect(component.getByText("6")).toBeInTheDocument()
  expect(component.getByText("7")).toBeInTheDocument()
  expect(component.getByText("8")).toBeInTheDocument()
  expect(component.getByText("Next").closest("li")?.classList).not.toContain("disabled")

  component.rerender(<Pagination
    current={1}
    total={10}
    onChange={()=>{}}
  />)

  items = component.getAllByRole("listitem")
  ellipsis = component.getAllByText("More")

  expect(items.length).toBe(11)
  expect(ellipsis.length).toBe(1)
  expect(component.getByText("Previous").closest("li")?.classList).toContain("disabled")
  expect(component.getByText("1")).toBeInTheDocument()
  expect(component.getByText("2")).toBeInTheDocument()
  expect(component.getByText("3")).toBeInTheDocument()
  expect(component.getByText("4")).toBeInTheDocument()
  expect(component.getByText("5")).toBeInTheDocument()
  expect(component.getByText("6")).toBeInTheDocument()
  expect(component.getByText("7")).toBeInTheDocument()
  expect(ellipsis[0].closest("li")?.classList).toContain("disabled")
  expect(component.getByText("10")).toBeInTheDocument()
  expect(component.getByText("Next").closest("li")?.classList).not.toContain("disabled")

  component.rerender(<Pagination
    current={6}
    total={11}
    onChange={()=>{}}
  />)

  items = component.getAllByRole("listitem")
  ellipsis = component.getAllByText("More")

  expect(items.length).toBe(11)
  expect(ellipsis.length).toBe(2)
  expect(component.getByText("Previous").closest("li")?.classList).not.toContain("disabled")
  expect(component.getByText("1")).toBeInTheDocument()
  expect(ellipsis[0].closest("li")?.classList).toContain("disabled")
  expect(component.getByText("4")).toBeInTheDocument()
  expect(component.getByText("5")).toBeInTheDocument()
  expect(component.getByText("6")).toBeInTheDocument()
  expect(component.getByText("7")).toBeInTheDocument()
  expect(component.getByText("8")).toBeInTheDocument()
  expect(ellipsis[1].closest("li")?.classList).toContain("disabled")
  expect(component.getByText("11")).toBeInTheDocument()
  expect(component.getByText("Next").closest("li")?.classList).not.toContain("disabled")

  fireEvent.click(component.getByText("1"))
  fireEvent.click(component.getByText("Previous"))
  fireEvent.click(component.getByText("Next"))
})