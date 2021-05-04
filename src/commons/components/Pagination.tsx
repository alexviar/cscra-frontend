import { useMemo, useEffect } from "react"
import { Button, Pagination } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import Qs from 'qs'

type Props = {
  // current: number,
  // minimum: number,
  // maximum: number,
  // total: number,  
  // onClickFirst: ()=>void,
  // onClickLast: ()=>void,
  // onClickPrev: ()=>void,
  // onClickNext: ()=>void,
  // onClickItem: (page: number)=>void
  current: number
  total: number
  onChange(page: number): void
}
export default ({current, total, onChange}: Props)=>{
  current = Math.min(current, total+1);
  let ld = current - 1
  let rd = total - current//Math.min(current, total)
  ld= Math.min(2+2-Math.min(2,rd), ld)
  rd = Math.min(2+2-Math.min(2,ld), rd)
  const minimum = current - ld
  const maximum=current + rd
  console.log("pag.", current, total, minimum,maximum)
  const pageItems = []
  if(maximum > 1 ) for(let i = minimum; i <= maximum; i++){
    if(current == i)
      pageItems.push(<Pagination.Item key={i} active={true}>{i}</Pagination.Item>)
    else
      // pageItems.push(<Pagination.Item key={i} as={Link} href={`${pathname}?${Qs.stringify({...parsedSearch, page: {current: i, size}}, { arrayFormat: "brackets", encode: false})}`} to={`${pathname}?${Qs.stringify({...parsedSearch, page: {current: i, size}}, { arrayFormat: "brackets", encode: false})}`}>{i}</Pagination.Item>)
      pageItems.push(<Pagination.Item key={i} onClick={()=>onChange(i)}>{i}</Pagination.Item>)
  }
  
  return <Pagination>
    {minimum > 1 ? <Pagination.First
      onClick={()=>onChange(1)}
    /> : null}
    {current > 1 ? <Pagination.Prev 
      onClick={()=>onChange(current-1)}
    /> : null}
    
    {pageItems}
    
    {current < total ? <Pagination.Next
      onClick={()=>onChange(current+1)}
    /> : null}
    {maximum < total ? <Pagination.Last
      onClick={()=>onChange(total)}
    /> : null}
      
  </Pagination>
}