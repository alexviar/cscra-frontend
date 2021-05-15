import { Permisos } from "../../../../commons/auth/constants";
import { useLoggedUser } from "../../../../commons/auth/hooks";

export const RolPolicy = {
  index: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.VER_ROLES,
      Permisos.REGISTRAR_ROLES,
    ])
  },
  register: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.REGISTRAR_ROLES,
    ])
  },
  edit: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.EDITAR_ROLES,
    ])
  },
  view: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.VER_ROLES,
    ])
  },
  delete: function(user: ReturnType<typeof useLoggedUser>){
    return user.canAny([
      Permisos.ELIMINAR_ROLES
    ])
  },
}