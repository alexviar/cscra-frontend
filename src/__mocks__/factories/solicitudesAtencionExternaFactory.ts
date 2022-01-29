import faker from 'faker'
import { medicosFactory, proveedoresFactory } from '.'
import { SolicitudAtencionExterna } from "../../apps/clinica/solicitud_atencion_externa/services"
import { BaseFactory } from './BaseFactory'
import moment from "moment"

export const solicitudesAtencionExternaFactory = BaseFactory.define<SolicitudAtencionExterna, any, BaseFactory<SolicitudAtencionExterna, any>>(({
  sequence,
  params,
  associations,
  afterBuild
}) => { 
  afterBuild(function(item) {
    solicitudesAtencionExternaFactory.push(item)
  })

  const regional = associations.regional || {
    id: 1,
    nombre: "La Paz"
  }
  const medico = associations.medico || medicosFactory.build() as any

  const proveedor =  associations.proveedor || proveedoresFactory.build() as any


  return {
    id: sequence,
    numero: String(sequence).padStart(10, '0'),
    fecha: moment(faker.date.recent(365)).format("L"),
    regionalId: regional.id,
    prestacion: faker.lorem.text(80),
    regional,
    proveedor,
    medico,
    paciente: {
      matricula: faker.helpers.replaceSymbols("##-####-???"),
      nombreCompleto: `${faker.name.lastName()} ${faker.name.lastName()} ${faker.name.firstName()}`
    },
    titular: {
      matricula: faker.helpers.replaceSymbols("##-####-???"),
      nombreCompleto: `${faker.name.lastName()} ${faker.name.lastName()} ${faker.name.firstName()}`
    },
    urlDm11: faker.internet.url()
  }

})