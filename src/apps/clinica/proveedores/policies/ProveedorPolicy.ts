import { Permisos, User } from "../../../../commons/auth";

export const ProveedorPolicy = {
  index: function(user: User){
    return user?.canAny([
      Permisos.VER_PROVEEDORES,
      Permisos.VER_PROVEEDORES_REGIONAL,
      Permisos.REGISTRAR_PROVEEDORES,
      Permisos.REGISTRAR_PROVEEDORES_REGIONAL
    ])
  },
  register: function(user: User){
    return user?.canAny([
      Permisos.REGISTRAR_PROVEEDORES,
      Permisos.REGISTRAR_PROVEEDORES_REGIONAL
    ])
  },
  edit: function(user: User){
    return user?.canAny([
      Permisos.EDITAR_PROVEEDORES,
      Permisos.EDITAR_PROVEEDORES_REGIONAL
    ])
  },
  view: function(user: User){
    return user?.canAny([
      Permisos.VER_PROVEEDORES,
      Permisos.VER_PROVEEDORES_REGIONAL
    ])
  },
  baja: function(user: User){
    return user?.canAny([
      // Permisos.BAJA_PROVEEDORES,
      // Permisos.BAJA_PROVEEDORES_REGIONAL
    ])
  }
}