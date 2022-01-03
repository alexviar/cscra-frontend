import { useMemo, useState } from "react";
import { AsyncTypeahead, AsyncTypeaheadProps } from "react-bootstrap-typeahead";
import { useQuery, useInfiniteQuery } from "react-query";
import { AutocompleteService } from "../services/AutocompleteService";

type Props = {
} & Partial<AsyncTypeaheadProps<{label: string}>>

export const MedicosTypeahead = (props: Props) => {

  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<{label: string}[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 10

  // const buscarInfinite = useInfiniteQuery(query, ({pageParam=1})=>{
  //   return AutocompleteService.medicos(query, pageParam, pageSize)
  // }, {
  //   enabled: !!query,
  //   getNextPageParam: (lastPage) => lastPage.data.meta.total,
  //   staleTime: 0,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false
  // })

  const buscar = useQuery([query, page], ({signal})=>{
    return AutocompleteService.medicos({query, page, pageSize}, {signal})
  }, {
    onSuccess: ({data}) =>{
      // console.log(data.records)
      const mappedRecords = data.records.map(label => ({label}))
      setOptions(prev => page == 1 ? mappedRecords : [...prev, ...mappedRecords])
    },
    enabled: !!query,
    staleTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  // useEffect(()=>{
  //   setEnabledSearch(true)
  // }, [])

  return <AsyncTypeahead
    id="asñlkdjfñklasdjñflasjio"
    allowNew
    //@ts-ignore
    newSelectionPrefix=""
    isLoading={false}
    maxResults={pageSize}
    minLength={1}
    onSearch={(query)=>{
      setQuery(query.trim().toUpperCase())
      // setOptions([])
      setPage(1)
    }}
    // onBlur={()=>{
    //   if(query && props.selected?.length === 0 && props.onChange ){
    //     props.onChange([query.trim().toUpperCase()])
    //   }
    // }}
    options={options}
    paginate
    onPaginate={(e, shownResults)=>{
      if(buscar.data && buscar.data.data.meta.total > options.length){
        setPage(prev => prev + 1)
      }
    }}
    useCache={false}
    {...props}
  />
}