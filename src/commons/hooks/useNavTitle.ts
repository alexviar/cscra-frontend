import { useRouteMatch } from "react-router-dom"

export const useNavTitle = () => {
  const iam = '/iam'
  const clinica = '/clinica'
  const seguimiento = '/seguimiento'
  const match = useRouteMatch([
    iam,
    clinica,
    seguimiento
  ])

  switch(match?.path){
    case iam: return 'IAM'
    case clinica: return 'Transferencias'
    case seguimiento: return 'Plan de seguimiento'
    default: return 'Caja de salud de caminos y R.A.'
  }
}