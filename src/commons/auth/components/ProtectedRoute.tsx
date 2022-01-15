import React from 'react'
import { Redirect, Route, RouteProps, useLocation } from 'react-router';
import { User, useUser } from '../hooks';

type Props = {
  authorize?: (user: User, url: string) => boolean | undefined
  children: React.ReactNode
} & RouteProps
export const ProtectedRoute = ({ children, authorize, ...rest }: Props) => {
  const { pathname: url, state } = useLocation<{
    ignoreAuthorization?: boolean
  }>()
  const ignoreAuthorization = state?.ignoreAuthorization
<<<<<<< HEAD
  const loggedUser = useLoggedUser()
=======
  const loggedUser = useUser()
>>>>>>> add_tests
  
  if(loggedUser == null) return null

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