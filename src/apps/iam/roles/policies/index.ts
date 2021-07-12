import { Permisos, User } from "../../../../commons/auth";

export const RolPolicy = {
  index: function(user: User){
    return user?.canAny([
      Permisos.VER_ROLES,
      Permisos.REGISTRAR_ROLES,
    ])
  },
  register: function(user: User){
    return user?.canAny([
      Permisos.REGISTRAR_ROLES,
    ])
  },
  edit: function(user: User){
    return user?.canAny([
      Permisos.EDITAR_ROLES,
    ])
  },
  view: function(user: User){
    return user?.canAny([
      Permisos.VER_ROLES,
    ])
  },
  delete: function(user: User){
    return user?.canAny([
      Permisos.ELIMINAR_ROLES
    ])
  },
}