import { Pagination as BSPagination } from "react-bootstrap"

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
export const Pagination = ({current, total, onChange}: Props)=>{
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
      pageItems.push(<BSPagination.Item key={i} active={true}>{i}</BSPagination.Item>)
    else
      pageItems.push(<BSPagination.Item key={i} onClick={()=>onChange(i)}>{i}</BSPagination.Item>)
  }
  
  return <BSPagination>
    {minimum > 1 ? <BSPagination.First
      onClick={()=>onChange(1)}
    /> : null}
    {current > 1 ? <BSPagination.Prev 
      onClick={()=>onChange(current-1)}
    /> : null}
    
    {pageItems}
    
    {current < total ? <BSPagination.Next
      onClick={()=>onChange(current+1)}
    /> : null}
    {maximum < total ? <BSPagination.Last
      onClick={()=>onChange(total)}
    /> : null}
      
  </BSPagination>
}

export default Pagination