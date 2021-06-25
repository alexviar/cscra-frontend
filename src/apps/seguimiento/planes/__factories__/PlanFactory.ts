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
  actividades: associations.actividades || actividadFactory.buildList(5)
}))