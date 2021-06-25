import faker from 'faker'
import { Factory } from 'fishery'
import { Actividad } from '../services'
import { avanceFactory } from './AvanceFactory'

class ActividadFactory extends Factory<Actividad> {

}

// instead of Factory.define<User>
export const actividadFactory = ActividadFactory.define(({sequence, associations}) => ({
  id: sequence,
  nombre: faker.lorem.words(3),
  inicio: faker.datatype.datetime().toISOString().split("T")[0],
  fin: faker.datatype.datetime().toISOString().split("T")[0],
  avance: faker.datatype.number(100),
  avanceEsperado: faker.datatype.number(100),
  estado: faker.random.arrayElement([1,2,3,4]),
  indicadores: faker.lorem.sentences(),
  historial: associations.historial || avanceFactory.buildList(10)
}))