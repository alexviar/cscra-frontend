import { useCallback } from "react"
import { Button, Navbar } from "react-bootstrap"
import { FaBars } from "react-icons/fa"
import { useRouteMatch } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

export const ToggleSidebar = ()=>{
  const match = useRouteMatch(["/", "/login", "/forbbiden"])
  const dispatch = useDispatch()

  const toggleSidebar = useCallback(() => {
    dispatch({
      type:"TOGGLE_SIDEBAR"
    })
  }, [])

  if(match!.isExact) return null
  return <Navbar.Toggle as={Button} style={{display: "initial"}} onClick={toggleSidebar} ><FaBars /></Navbar.Toggle>
}