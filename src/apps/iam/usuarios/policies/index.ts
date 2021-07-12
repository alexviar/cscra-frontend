import { Permisos, User } from "../../../../commons/auth";

export const UsuarioPolicy = {
  index: function(user: User){
    return user?.canAny([
      Permisos.VER_USUARIOS,
      Permisos.VER_USUARIOS_DE_LA_MISMA_REGIONAL_QUE_EL_USUARIO,
      Permisos.REGISTRAR_USUARIOS,
      Permisos.REGISTRAR_USUARIOS_DE_LA_MISMA_REGIONAL_QUE_EL_USUARIO
    ])
  },
  register: function(user: User){
    return user?.canAny([
      Permisos.REGISTRAR_USUARIOS,
      Permisos.REGISTRAR_USUARIOS_DE_LA_MISMA_REGIONAL_QUE_EL_USUARIO
    ])
  },
  edit: function(user: User){
    return user?.canAny([
      Permisos.EDITAR_USUARIOS,
      Permisos.EDITAR_USUARIOS_DE_LA_MISMA_REGIONAL_QUE_EL_USUARIO
    ])
  },
  view: function(user: User){
    return user?.canAny([
      Permisos.VER_USUARIOS,
      Permisos.VER_USUARIOS_DE_LA_MISMA_REGIONAL_QUE_EL_USUARIO
    ])
  },
  changePassword: function(user: User){
    return user?.canAny([
      Permisos.CAMBIAR_CONTRASEÑA,
      Permisos.CAMBIAR_CONTRASEÑA_DE_LA_MISMA_REGIONAL_QUE_EL_USUARIO
    ])
  },
  disable: function(user: User){
    return user?.canAny([
      Permisos.BLOQUEAR_USUARIOS,
      Permisos.BLOQUEAR_USUARIOS_DE_LA_MISMA_REGIONAL_QUE_EL_USUARIO
    ])
  },
  enable: function(user: User){
    return user?.canAny([
      Permisos.DESBLOQUEAR_USUARIOS,
      Permisos.DESBLOQUEAR_USUARIOS_DE_LA_MISMA_REGIONAL_QUE_EL_USUARIO
    ])
  },
}