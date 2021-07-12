import faker from 'faker'
import { Factory } from 'fishery'
import { Regional } from '../../../../commons/services/RegionalesService'

class RegionalFactory extends Factory<Regional> {

}

// instead of Factory.define<User>
export const regionalFactory = RegionalFactory.define(({sequence, associations}) => ({
  id: sequence,
  nombre: faker.unique(()=> faker.lorem.word())
}))