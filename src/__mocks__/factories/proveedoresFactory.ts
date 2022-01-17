import faker from 'faker'
import { Proveedor } from "../../apps/clinica/proveedores/services"
import { BaseFactory } from './BaseFactory'

export const proveedoresFactory = BaseFactory.define<Proveedor, any, BaseFactory<Proveedor, any>>(({
  sequence,
  params,
  associations,
  afterBuild
}) => { 
  afterBuild(function(item) {
    proveedoresFactory.push(item)
  })

  const regional = associations.regional || {
    id: 1,
    nombre: "La Paz"
  }

  if(Math.random() > 0.5){
    return {
      id: sequence,
      tipo: 2,
      nit: faker.helpers.replaceSymbolWithNumber('###########'),
      nombre: faker.company.companyName(),
      estado: faker.helpers.randomize([1, 2]),
      regionalId: regional.id,
      regional,

      direccion: faker.address.streetAddress(),
      ubicacion: null,
      telefono1: parseInt(faker.phone.phoneNumber('#######')),
      telefono2: null
    }
  }
  else{
    const ci = {
      raiz: parseInt(faker.helpers.replaceSymbolWithNumber('#######')),
      complemento: Math.random() > 0.9 ? faker.helpers.replaceSymbols('?#') : null,
      texto: ""
    }
  
    ci.texto = ci.raiz + (ci.complemento ? `-${ci.complemento}` : "")
    
    const nombre = {
      nombre: faker.name.firstName(),
      apellidoPaterno: faker.name.lastName(),
      apellidoMaterno: faker.name.lastName(),
      nombreCompleto: ""
    }
    nombre.nombreCompleto = nombre.nombre
    if(nombre.apellidoPaterno) nombre.nombreCompleto += " " + nombre.apellidoPaterno
    if(nombre.apellidoMaterno) nombre.nombreCompleto += " " + nombre.apellidoMaterno
  
    return {
      id: sequence,
      tipo: 1,
      nit: faker.helpers.replaceSymbolWithNumber('###########'),
      ci,
      ...nombre,
      especialidad: faker.helpers.randomize(["Neurologia", "Gastroenterologia", "Otorrinolaringologia", "Ginicologia"]),
      estado: faker.helpers.randomize([1, 2]),
      regionalId: regional.id,
      regional,

      direccion: faker.address.streetAddress(),
      ubicacion: null,
      telefono1: parseInt(faker.phone.phoneNumber('#######')),
      telefono2: null
    }
  }

})