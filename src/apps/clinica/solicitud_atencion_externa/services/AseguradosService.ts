import { AxiosTransformer } from "axios"
import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"

// export type Titular = {
//   id: string,
//   matricula: string,
//   apellidoPaterno: string | null,
//   apellidoMaterno: string,
//   nombres: string,
//   estado: string,
//   fechaBaja?: string,
//   fechaExtinsion?: string,
//   empleador: {
//     id: number,
//     numeroPatronal: string,
//     nombre: string,
//     estado: string,
//     aportes: string
//   }
// }

// type Beneficiario = Titular & {
//   fechaExtinsion?: string
// }

// export type Asegurado = Titular | Beneficiario
export type Asegurado = {
  id: string,
  matricula: string,
  matriculaComplemento: string,
  apellidoPaterno: string | null,
  apellidoMaterno: string,
  nombres: string,
  tipo_id: number,
  estado: number,
  baja: {
    regDate: string,
    fechaValidezSeguro: string
  },
  fechaExtinsion?: string
  titularId: string
  empleador: {
    id: number,
    numeroPatronal: string,
    nombre: string,
    estado: string,
    fechaBaja: string,
    aportes: string
  }
  titular?: {
    id: string,
    matricula: string,
    apellidoPaterno: string | null,
    apellidoMaterno: string | null,
    nombres: string,
    estado: string,
    baja: {
      regDate: string,
      fechaValidezSeguro: string
    },
  }
}

export const AseguradosService = {
  buscarPorMatricula: (matricula: string) =>{
    return apiClient.get<PaginatedResponse<Asegurado>>("asegurados", {
      params: {
        filter: {
          matricula
        },
        page: {
          size: 10
        },
        include: "empleador,titular"
      },
      // transformResponse: [...apiClient.defaults.transformResponse as AxiosTransformer[], (response:any)=>{
      //   console.log(response)
      //   return response
      // }]
    })
  }
}