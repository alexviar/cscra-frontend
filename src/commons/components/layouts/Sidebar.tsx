import React, { ComponentProps } from 'react'
import { ListGroup } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom'

type MenuItem = {
  id: string,
  title: string,
  path: string,
  icon?: React.ReactNode,
  items?: undefined
} | {
  id: string,
  title: string,
  path?: string,
  icon?: React.ReactNode,
  items: {
    id: string,
    title: string,
    path: string,
    icon?: React.ReactNode,
  }[]
}

const SidebarItem = (item: MenuItem)=>{
  const match = useRouteMatch(item.path || "")

  return <>
    {item.path ?
      <ListGroup.Item as={Link} to={item.path} 
        action
        active={!!match}
        className="border-0 text-nowrap"
        style={{
          padding: ".5rem 1rem"
        }}
        key={item.id}>
          {item.icon}<span style={{verticalAlign: 'middle', marginLeft: '0.5rem'}}>{item.title}</span>
      </ListGroup.Item> : 
      <div
        className="list-group-item border-0 text-nowrap"
        style={{
          padding: ".5rem 1rem"
        }}
        key={item.id}>
          {item.icon}<span style={{verticalAlign: 'middle', marginLeft: '0.5rem'}}>{item.title}</span>
      </div>
    }
    {item.items && item.items.map(subitem=>{
      return <Link to={subitem.path} 
        style={{
          padding: ".5rem 1rem",
          paddingLeft: "2rem"
        }}
        className="list-group-item list-group-item-action border-0 text-nowrap" 
        key={subitem.id}>
          {subitem.icon || null}<span style={{verticalAlign: 'middle', marginLeft: '0.5rem'}}>{subitem.title}</span>
      </Link>
    })}
  </>
}

export type SidebarProps = ComponentProps<"div"> & {
  side?: 'left' | 'right',
  header?: string | JSX.Element,
  items?: MenuItem[],
  renderItem?: (item: MenuItem) => JSX.Element
}
export const Sidebar = (props: SidebarProps) => {
  const {className="", side="right", header="", items=[], renderItem} = props
  const borderClass = {left: 'border-left', right: 'border-right'}
  return <div className={`${className}  ${borderClass[side]}`} id="sidebar-wrapper">
    <div className="sidebar-heading mt-2">{header}</div>
    <hr className="mx-2"></hr>
    <ListGroup variant="flush">
      {items.map(item=>(
        <SidebarItem key={item.id} {...item} />
      ))}      
    </ListGroup>
    {/* <div className="list-group list-group-flush">
      {items.map(item=><a href="#" className="list-group-item list-group-item-action" key={item.id}>{renderItem ? renderItem(item):item.title}</a>)}
    </div> */}
  </div>
  
}