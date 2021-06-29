import faker from 'faker'
import { Factory } from 'fishery'
import { Avance } from '../services'
import moment from 'moment'

class AvanceFactory extends Factory<Avance> {
  inDateRange(inicio: any, fin:any) {
    // inicio = moment(inicio)
    // fin = moment(fin)
    return this.transient({
      range: {
        inicio,
        fin
      }
    })
  }
}

// instead of Factory.define<User>
export const avanceFactory = AvanceFactory.define(({transientParams, sequence, associations}) => ({
  id: sequence,
  fecha: transientParams.range ? faker.date.between(transientParams.range.inicio, transientParams.range.fin).toISOString().split("T")[0] : faker.datatype.datetime().toISOString().split("T")[0],
  esperado: faker.datatype.number(100),
  actual: faker.datatype.number(100),
  informe: faker.internet.url(),
  observaciones: faker.lorem.sentence()
}))