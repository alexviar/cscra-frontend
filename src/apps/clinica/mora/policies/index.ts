import { Permisos } from "../../../../commons/auth/constants";
import { useLoggedUser } from "../../../../commons/auth/hooks";

export const ListaMoraPolicy = {
  index: (user: ReturnType<typeof useLoggedUser>) => {
    return user.canAny([
      Permisos.VER_LISTA_DE_MORA,
      Permisos.VER_LISTA_DE_MORA_REGIONAL,
      Permisos.AGREGAR_EMPLEADOR_EN_MORA,
      Permisos.AGREGAR_EMPLEADOR_EN_MORA_DE_LA_MISMA_REGIONAL
    ])
  },
  view: (user: ReturnType<typeof useLoggedUser>) => {
    return user.canAny([
      Permisos.VER_LISTA_DE_MORA,
      Permisos.VER_LISTA_DE_MORA_REGIONAL
    ])
  },
  agregar: (user: ReturnType<typeof useLoggedUser>) => {
    return user.canAny([
      Permisos.AGREGAR_EMPLEADOR_EN_MORA,
      Permisos.AGREGAR_EMPLEADOR_EN_MORA_DE_LA_MISMA_REGIONAL
    ])
  },
  quitar: (user: ReturnType<typeof useLoggedUser>) => {
    return user.canAny([
      Permisos.QUITAR_EMPLEADOR_EN_MORA,
      Permisos.QUITAR_EMPLEADOR_EN_MORA_DE_LA_MISMA_REGIONAL
    ])
  },
}