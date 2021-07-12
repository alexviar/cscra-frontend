import faker from 'faker'
import { Factory } from 'fishery'
import { Area } from '../services'

class AreaFactory extends Factory<Area> {

}

// instead of Factory.define<User>
export const areaFactory = AreaFactory.define(({sequence, associations}) => ({
  id: sequence,
  nombre: faker.unique(() => faker.lorem.word())
}))