import apiClient from "../../../../commons/services/apiClient"

type Empleador = {
  id: number,
  numeroPatronal: string,
  nombre: string
}

export const EmpleadorService = {
  buscarPorPatronal: (numeroPatronal: string) => {
    return apiClient.get<Empleador>("empleadores", {
      params: {
        filter: {
          numero_patronal: numeroPatronal
        },
        first: true
      }
    })
  }
}