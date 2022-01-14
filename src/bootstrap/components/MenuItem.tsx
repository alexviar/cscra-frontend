import { NavLink, NavLinkProps } from "react-router-dom"

type Props = NavLinkProps

export const MenuItem = ({className, ...props}: Props)=>{
  return <NavLink className={className ? className + " nav-link" : "nav-link"} {...props}/>
}