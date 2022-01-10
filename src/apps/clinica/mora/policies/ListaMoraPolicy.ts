import { User } from "../../../../commons/auth/hooks";
import { 
  VER_LISTA_DE_MORA,
  VER_LISTA_DE_MORA_REGIONAL,
  AGREGAR_EMPLEADOR_EN_MORA,
  AGREGAR_EMPLEADOR_EN_MORA_DE_LA_MISMA_REGIONAL,
  QUITAR_EMPLEADOR_EN_MORA,
  QUITAR_EMPLEADOR_EN_MORA_DE_LA_MISMA_REGIONAL
} from "./Permisos";

export const ListaMoraPolicy = {
  index: (user: User) => {
    return user?.canAny([
      VER_LISTA_DE_MORA,
      VER_LISTA_DE_MORA_REGIONAL,
      AGREGAR_EMPLEADOR_EN_MORA,
      AGREGAR_EMPLEADOR_EN_MORA_DE_LA_MISMA_REGIONAL
    ])
  },
  view: (user: User) => {
    return user?.canAny([
      VER_LISTA_DE_MORA,
      VER_LISTA_DE_MORA_REGIONAL
    ])
  },
  verPorRegional: (user: User) => {
    return user?.canAny([
      VER_LISTA_DE_MORA_REGIONAL
    ])
  },
  agregar: (user: User) => {
    return user?.canAny([
      AGREGAR_EMPLEADOR_EN_MORA,
      AGREGAR_EMPLEADOR_EN_MORA_DE_LA_MISMA_REGIONAL
    ])
  },
  quitar: (user: User) => {
    return user?.canAny([
      QUITAR_EMPLEADOR_EN_MORA,
      QUITAR_EMPLEADOR_EN_MORA_DE_LA_MISMA_REGIONAL
    ])
  },
}