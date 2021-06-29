import faker from 'faker'
import { Factory } from 'fishery'
import { Avance } from '../services'

class AvanceFactory extends Factory<Avance> {

}

// instead of Factory.define<User>
export const avanceFactory = AvanceFactory.define(({sequence, associations}) => ({
  id: sequence,
  fecha: faker.datatype.datetime().toISOString().split("T")[0],
  esperado: faker.datatype.number(100),
  actual: faker.datatype.number(100),
  informe: faker.internet.url(),
  observaciones: faker.lorem.sentence()
}))