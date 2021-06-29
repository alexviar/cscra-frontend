import { useMemo } from 'react'
import { useRouteMatch, Switch, useLocation} from 'react-router-dom'
import { Image, Modal } from 'react-bootstrap'
import { FaTasks } from 'react-icons/fa'
import SidebarLayout from '../../commons/components/layouts/SidebarLayout'
import { ProtectedRoute } from '../../commons/auth/components'
import { useLoggedUser } from '../../commons/auth/hooks'
import { removeTrailingSlashes } from '../../commons/utils'
import { PlanIndex, PlanForm, PlanView, ActividadView, AvanceForm } from './planes'

export const SeguimientoApp = ()=>{
  const match = useRouteMatch()
  const url = removeTrailingSlashes(match.url)
  const location = useLocation<any>()
  const loggedUser = useLoggedUser()

  const sidebarItems = useMemo(()=>{
    const items = [] as any[]
      items.push({
        id: "planes",
        icon: <FaTasks />,
        path: `${url}/planes`,
        title: "Planes",
      })
    return items
  }, [loggedUser])

  const background = location.state?.background || location

  return <SidebarLayout 
    sidebar={{
        header: <div className="d-flex justify-content-center"><Image src="/logo-lg.png" /></div>,
        items: sidebarItems
    }}
  >
    <Switch location={background}>
      <ProtectedRoute exact path={`${url}/planes`}
      >
        <PlanIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={[`${url}/planes/registrar`]}
      >
        <PlanForm />
      </ProtectedRoute>
      <ProtectedRoute path={`${url}/planes/:planId/actividades/:actividadId`}
      >
        <ActividadView />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/planes/:planId`}
      >
        <PlanView />
      </ProtectedRoute>
    </Switch>
    <ProtectedRoute exact path={`${url}/planes/:planId/actividades/:actividadId/registrar-avance`}
    >
      <AvanceForm />
    </ProtectedRoute>   
    <ProtectedRoute exact path={`${url}/planes/:planId/actividades/:actividadId/grafico`}
    >
      <Modal show={true}>
        Grafico
      </Modal>
    </ProtectedRoute>  
  </SidebarLayout>
}

export default SeguimientoApp