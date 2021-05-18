import { Permisos } from "../../../../commons/auth/constants";
import { useLoggedUser } from "../../../../commons/auth/hooks";

export const SolicitudATPolicy = {
  index: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR,
      Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL
    ])
  },
  register: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL
    ])
  },
  view: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR,
    ])
  },
  emit: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL,
      Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR
    ])
  }
}