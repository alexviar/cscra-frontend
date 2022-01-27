import faker from 'faker'
import { ListaMoraItem } from "../../apps/clinica/mora/services/ListaMoraService";
import { BaseFactory } from './BaseFactory';

// instead of Factory.define<User>
export const listaMoraFactory = BaseFactory.define<ListaMoraItem, any, BaseFactory<ListaMoraItem, any>>(({
  sequence,
  params,
  associations,
  afterBuild
}) => { 
  afterBuild(function(item) {
    listaMoraFactory.data.push(item)
  })

  const regional = associations.regional || {
    id: 1,
    nombre: "La Paz"
  }

  return {
    id: sequence,
    empleadorId: params.empleadorId || faker.helpers.replaceSymbolWithNumber("AA###############"),
    numeroPatronal: params.numeroPatronal ||  faker.helpers.replaceSymbolWithNumber("###-#####"),
    nombre: params.nombre || faker.company.companyName(),
    regionalId: regional.id,
    regional
  }
})