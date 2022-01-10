import { Pagination as BSPagination } from "react-bootstrap"

type Props = {
  current: number
  total: number
  onChange(page: number): void
}
export const Pagination = ({current, total, onChange}: Props)=>{
  current = Math.max(Math.min(current, total+1), 1);

  const pageItems = []

  const renderItem = (page: number)=>{
    if(current == page)
      return <BSPagination.Item activeLabel="Pagina actual" key={page} active={true}>{page}</BSPagination.Item>
    else
      return <BSPagination.Item aria-label={`Ir a la pagina ${page}`} key={page} onClick={()=>onChange(page)}>{page}</BSPagination.Item>
  }


  const n = 9
  let page = 1
  while(page <= total){
    if(pageItems.length == 1 && total > n && current - Math.floor(n/2) > 1){
      pageItems.push(<BSPagination.Ellipsis key={"left-ellipsis"} disabled />)
      page = current - Math.floor(n/4)
    }
    else if(pageItems.length == n - 2 ){
      if(total > n && current + Math.floor(n/2) < total){
        pageItems.push(<BSPagination.Ellipsis key={"right-ellipsis"} disabled />)
        page = total
      }
    }
    pageItems.push(renderItem(page++))
  }


  
  return <nav aria-label="Paginador">
    {total > 0 && <BSPagination>
      <BSPagination.Prev 
        disabled={current == 1}
        onClick={()=>onChange(current-1)}
      />
      {pageItems}   
      <BSPagination.Next
        disabled={current == total}
        onClick={()=>onChange(current+1)}
      />
        
    </BSPagination>}
  </nav>
}

export default Pagination