import faker from 'faker'
import { Factory } from 'fishery';
import { ListaMoraItem } from "../ListaMoraService";

class BaseFactory<T, I = any> extends Factory<T, I> {
  data: T[] = []

  clear() {
    this.data = []
  }

  remove(e: T) {
    this.data = this.data.filter((d) => d !== e)
  }
}

// instead of Factory.define<User>
export const listaMoraFactory = BaseFactory.define<ListaMoraItem, any, BaseFactory<ListaMoraItem, any>>(({
  sequence,
  params,
  afterBuild
}) => { 
  afterBuild(function(item) {
    listaMoraFactory.data.push(item)
    //this.push(item)
  })

  return {
    id: sequence,
    empleadorId: params.empleadorId || faker.helpers.replaceSymbolWithNumber("AA###############"),
    numeroPatronal: params.numeroPatronal ||  faker.helpers.replaceSymbolWithNumber("###-#####"),
    nombre: params.nombre || faker.company.companyName()
  }
})