import faker from 'faker'
import { Factory } from 'fishery'
import { Plan } from '../services'
import { actividadFactory } from './ActividadFactory'

class PlanFactory extends Factory<Plan> {

}

export const planFactory = PlanFactory.define(({sequence, associations}) => ({
  id: sequence,
  objetivoGeneral: faker.hacker.phrase(),
  concluido: faker.datatype.boolean(),
  regionalId: associations.regionalId || 1,
  areaId: associations.areaId || 1,
  avance: 0,
  avanceEsperado: 0,
  usuarioId: 1,
  regional: {
    id: 1,
    nombre: "La Paz"
  },
  area: {
    id: 1,
    nombre: "Contabilidad"
  },
  actividades: associations.actividades || actividadFactory.buildList(5)
}))
