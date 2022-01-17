import apiClient from "../../../../commons/services/apiClient"

type Empleador = {
  id: string,
  numeroPatronal: string,
  nombre: string
}

export const EmpleadorService = {
  buscarPorPatronal: (numeroPatronal: string) => {
    return apiClient.get<Empleador>("empleadores/buscar-por-patronal", {
      params: {
        numero_patronal: numeroPatronal
      }
    })
  }
}