import { Permisos, useLoggedUser } from "../../../../commons/auth";

export const ContratoPolicy = {
  index: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.VER_CONTRATOS_PROVEEDOR,
      Permisos.VER_CONTRATOS_PROVEEDOR_REGIONAL,
      Permisos.REGISTRAR_CONTRATOS_PROVEEDOR,
      Permisos.REGISTRAR_CONTRATOS_PROVEEDOR_REGIONAL
    ])
  },
  register: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.REGISTRAR_CONTRATOS_PROVEEDOR,
      Permisos.REGISTRAR_CONTRATOS_PROVEEDOR_REGIONAL
    ])
  },
  consumir: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.CONSUMIR_CONTRATOS_PROVEEDOR,
      Permisos.CONSUMIR_CONTRATOS_PROVEEDOR_REGIONAL
    ])
  },
  extender: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.EXTENDER_CONTRATOS_PROVEEDOR,
      Permisos.EXTENDER_CONTRATOS_PROVEEDOR_REGIONAL
    ])
  },
  view: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.VER_CONTRATOS_PROVEEDOR,
      Permisos.VER_CONTRATOS_PROVEEDOR_REGIONAL
    ])
  },
  anular: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      // Permisos.ANULAR_CONTRATOS_PROVEEDOR,
      // Permisos.ANULAR_CONTRATOS_PROVEEDOR_REGIONAL
    ])
  }
}