import faker from 'faker'
import { Factory } from 'fishery'
import { Actividad } from '../services'
import { avanceFactory } from './AvanceFactory'
import moment from 'moment'

class ActividadFactory extends Factory<Actividad> {

}

// instead of Factory.define<User>
export const actividadFactory = ActividadFactory.define(({sequence, associations}) => {
  const inicio = faker.datatype.datetime().toISOString().split("T")[0]
  const fin = moment(inicio).add(14, 'days').format('YYYY-MM-DD')
  return {
    id: sequence,
    nombre: faker.lorem.words(3),
    inicio,
    fin,
    avance: faker.datatype.number(100),
    avanceEsperado: faker.datatype.number(100),
    estado: faker.random.arrayElement([1,2,3,4]),
    indicadores: faker.lorem.sentences(),
    historial: associations.historial || avanceFactory.inDateRange(inicio, fin).buildList(10)
  }
})