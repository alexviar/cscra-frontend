import React, { ComponentProps } from 'react'
import { Link, Router } from 'react-router-dom'
import { JsxElement } from 'typescript'

type MenuItem = {
  id: string,
  title: string,
  path: string,
  icon?: React.ReactNode,
  items?: MenuItem[]
}

const SidebarItem = (item: MenuItem)=>{
  return <>
    <Link to={item.path} 
      className="list-group-item list-group-item-action border-0 text-nowrap"
      style={{
        padding: ".5rem 1rem"
      }}
      key={item.id}>
        {item.icon}<span style={{verticalAlign: 'middle', marginLeft: '0.5rem'}}>{item.title}</span>
    </Link>
    {item.items && item.items.map(subitem=>{
      return <Link to={subitem.path} 
        style={{
          padding: ".5rem 1rem",
          paddingLeft: "2rem"
        }}
        className="list-group-item list-group-item-action border-0 text-nowrap" 
        key={subitem.id}>
          {subitem.icon}<span style={{verticalAlign: 'middle', marginLeft: '0.5rem'}}>{subitem.title}</span>
      </Link>
    })}
  </>
}

export type SidebarProps = ComponentProps<"div"> & {
  side?: 'left' | 'right',
  title?: string | JsxElement,
  items?: MenuItem[],
  renderItem?: (item: MenuItem) => JsxElement
}
export const Sidebar = (props: SidebarProps) => {
  const {className="", side="right", title="", items=[], renderItem, ...rest} = props
  const borderClass = {left: 'border-left', right: 'border-right'}
  return <div className={`${className}  ${borderClass[side]}`} id="sidebar-wrapper">
    <div className="sidebar-heading">{title}</div>
    <div className="list-group">
      {items.map(item=>(
        <SidebarItem key={item.id} {...item} />
      ))}      
    </div>
    {/* <div className="list-group list-group-flush">
      {items.map(item=><a href="#" className="list-group-item list-group-item-action" key={item.id}>{renderItem ? renderItem(item):item.title}</a>)}
    </div> */}
  </div>
  
}