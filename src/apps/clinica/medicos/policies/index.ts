import { Permisos, User } from "../../../../commons/auth";

export const MedicoPolicy = {
  index: function(user: User){
    return user?.canAny([
      Permisos.VER_MEDICOS,
      Permisos.VER_MEDICOS_REGIONAL,
      Permisos.REGISTRAR_MEDICOS,
      Permisos.REGISTRAR_MEDICOS_REGIONAL
    ])
  },
  register: function(user: User){
    return user?.canAny([
      Permisos.REGISTRAR_MEDICOS,
      Permisos.REGISTRAR_MEDICOS_REGIONAL
    ])
  },
  edit: function(user: User){
    return user?.canAny([
      Permisos.EDITAR_MEDICOS,
      Permisos.EDITAR_MEDICOS_REGIONAL
    ])
  },
  view: function(user: User){
    return user?.canAny([
      Permisos.VER_MEDICOS,
      Permisos.VER_MEDICOS_REGIONAL
    ])
  },
  baja: function(user: User){
    return user?.canAny([
      Permisos.BAJA_MEDICOS,
      Permisos.BAJA_MEDICOS_REGIONAL
    ])
  }
}