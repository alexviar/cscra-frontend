import React from 'react'
import { Container } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { ClickOutsideHandler } from '../../click-outside-handler'
import { Sidebar, SidebarProps } from './Sidebar'
import "./simple-sidebar.css"

type Props = {
  sidebar: SidebarProps
  children: React.ReactNode
}
export const SidebarLayout = ({sidebar, children}: Props) => {
  const showSidebar = useSelector((state:any) => state.sidebarVisibility)
  const dispatch = useDispatch()

  const onClickOutsideHandler = React.useCallback((event: MouseEvent | TouchEvent)=>{
    console.log(event.target)
    const toggle = document.querySelector('[aria-label="Toggle navigation"]')
    if(!toggle?.contains(event.target as Node)){
      dispatch({
        type: "CLOSE_SIDEBAR"
      })
    }
  }, [showSidebar])
  
  return <div className={"position-relative d-flex flex-grow-1 bg-light" + (showSidebar ? " toggled" : "")}  id="wrapper">
    <ClickOutsideHandler onClickOutside={onClickOutsideHandler}>
      <Sidebar className="bg-white shadow-sm" {...sidebar}/>
    </ClickOutsideHandler>
    <Container className="d-flex flex-column flex-grow-1">
      <div className="d-flex flex-column bg-white rounded-lg shadow-sm m-2 p-3 flex-grow-1">
        {children}
      </div>
    </Container>
  </div>
}

export default SidebarLayout