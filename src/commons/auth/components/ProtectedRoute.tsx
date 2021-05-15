import React from 'react'
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';
import { useLoggedUser } from '../hooks';

type Props = {
  authorize?: (user: ReturnType<typeof useLoggedUser>, url: string) => boolean
  children: React.ReactNode
} & RouteProps
export const ProtectedRoute = ({ children, authorize, ...rest }: Props) => {
  const { pathname: url, state: { ignoreAuthorization } = {} } = useLocation<{
    ignoreAuthorization?: boolean
  }>()
  const loggedUser = useLoggedUser()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedUser ? (
          !authorize || authorize(loggedUser, url) || ignoreAuthorization ? children : <Redirect
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