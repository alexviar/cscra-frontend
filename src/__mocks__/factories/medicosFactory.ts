import faker from 'faker'
import { Medico } from "../../apps/clinica/medicos/services"
import { BaseFactory } from './BaseFactory'

export const medicosFactory = BaseFactory.define<Medico, any, BaseFactory<Medico, any>>(({
  sequence,
  params,
  associations,
  afterBuild
}) => { 
  afterBuild(function(item) {
    medicosFactory.push(item)
  })

  const ci = {
    raiz: parseInt(faker.helpers.replaceSymbolWithNumber('#######')),
    complemento: Math.random() > 0.9 ? faker.helpers.replaceSymbols('?#') : null,
    texto: ""
  }

  ci.texto = ci.raiz + (ci.complemento ? `-${ci.complemento}` : "")
  
  const nombre = {
    nombres: faker.name.firstName(),
    apellidoPaterno: faker.name.lastName(),
    apellidoMaterno: faker.name.lastName(),
    nombreCompleto: ""
  }
  nombre.nombreCompleto = nombre.nombres
  if(nombre.apellidoPaterno) nombre.nombreCompleto += " " + nombre.apellidoPaterno
  if(nombre.apellidoMaterno) nombre.nombreCompleto += " " + nombre.apellidoMaterno

  const regional = associations.regional || {
    id: 1,
    nombre: "La Paz"
  }

  return {
    id: sequence,
    ci,
    ...nombre,
    especialidad: faker.helpers.randomize(["Neurologia", "Gastroenterologia", "Otorrinolaringologia", "Ginicologia"]),
    estado: faker.helpers.randomize([1, 2]),
    regionalId: regional.id,
    regional
  }
})