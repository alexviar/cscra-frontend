import apiClient from "./apiClient"

export type Departamento = {
  id: number,
  nombre: string,
  abreviatura: string
}

export type Provincia = {
  id: number,
  nombre: string
  departamentoId: number
}

export type Municipio = {
  id: number,
  nombre: string
  provinciaId: number
}

export const UnidadesTerritorialesService = {
  getDepartamentos: ()=>{
    return apiClient.get<Departamento[]>("departamentos")
  },
  getProvincias: () => {
    return apiClient.get<Provincia[]>("provincias")
  },
  getMunicipios: () => {
    return apiClient.get<Municipio[]>("municipios")
  }
}