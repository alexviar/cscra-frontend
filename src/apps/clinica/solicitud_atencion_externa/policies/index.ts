import { Permisos, User } from "../../../../commons/auth";

export const SolicitudATPolicy = {
  index: function(user: User){
    return user?.canAny([
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR,
      Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL
    ])
  },
  register: function(user: User){
    return user?.canAny([
      Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL
    ])
  },
  view: function(user: User){
    return user?.canAny([
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR,
    ])
  },
  emit: function(user: User){
    return user?.canAny([
      Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL,
      Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR
    ])
  }
}