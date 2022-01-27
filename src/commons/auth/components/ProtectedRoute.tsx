import React from 'react'
import { Redirect, Route, RouteProps, useLocation } from 'react-router';
import { User, useUser } from '../hooks';
import { superUserPolicyEnhancer } from '../utils';

type Props = {
  authorize?: (user: User, url: string) => boolean | undefined
  children: React.ReactNode
} & RouteProps
export const ProtectedRoute = ({ children, authorize, ...rest }: Props) => {
  const { pathname: url, state } = useLocation<{
    ignoreAuthorization?: boolean
  }>()
  const ignoreAuthorization = state?.ignoreAuthorization
  const user = useUser()
  
  /** TODO: Mostrar un mensaje adecuado hasta obtener los datos del servidor */
  if(user === undefined) return null

  console.log(user)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          !authorize || superUserPolicyEnhancer(authorize)(user, url) || ignoreAuthorization ? children : <Redirect
            to="/forbidden"
          />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default ProtectedRoute