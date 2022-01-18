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
  const medico = associations.medico || medicosFactory.build()

  const proveedor =  associations.proveedor || proveedoresFactory.build()


  return {
    id: sequence,
    numero: String(sequence).padStart(10, '0'),
    fecha: moment(faker.date.recent(365)).format("L"),
    regionalId: regional.id,
    regional,
    proveedor,
    medico,
    asegurado: {
      matricula: faker.helpers.replaceSymbols("##-####-???")
    },
    urlDm11: faker.internet.url()
  }

})