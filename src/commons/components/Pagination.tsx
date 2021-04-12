import { useMemo, useEffect } from "react"
import { Button, Pagination } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import Qs from 'qs'

type Props = {
  current: number,
  minimum: number,
  maximum: number,
  total: number,  
  onClickFirst: ()=>void,
  onClickLast: ()=>void,
  onClickPrev: ()=>void,
  onClickNext: ()=>void,
  onClickItem: (page: number)=>void
}
export default ({current, minimum, maximum, total, ...props}: Props)=>{
  const pageItems = []
  for(let i = minimum; i <= maximum; i++){
    if(current == i)
      pageItems.push(<Pagination.Item key={i} active={true}>{i}</Pagination.Item>)
    else
      // pageItems.push(<Pagination.Item key={i} as={Link} href={`${pathname}?${Qs.stringify({...parsedSearch, page: {current: i, size}}, { arrayFormat: "brackets", encode: false})}`} to={`${pathname}?${Qs.stringify({...parsedSearch, page: {current: i, size}}, { arrayFormat: "brackets", encode: false})}`}>{i}</Pagination.Item>)
      pageItems.push(<Pagination.Item key={i} onClick={()=>props.onClickItem(i)}>{i}</Pagination.Item>)
  }
  
  return <Pagination>
    {minimum > 1 ? <Pagination.First
      onClick={props.onClickFirst}
    /> : null}
    {current > 1 ? <Pagination.Prev 
      onClick={props.onClickPrev}
    /> : null}
    
    {pageItems}
    
    {current < total ? <Pagination.Next
      onClick={props.onClickNext}
    /> : null}
    {maximum < total ? <Pagination.Last
      onClick={props.onClickLast}
    /> : null}
      
  </Pagination>
}