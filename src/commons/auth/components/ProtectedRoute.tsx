import React from 'react'
import { Redirect, Route, RouteProps, useLocation } from 'react-router';
import { User, useUser } from '../hooks';
import { superUserPolicyEnhancer } from '../utils';

type Props = {
  authorize?: (user: User, url: string) => boolean | undefined
  children: React.ReactNode
} & RouteProps
export const ProtectedRoute = ({ children, authorize, ...rest }: Props) => {
  const location = useLocation<{
    ignoreAuthorization?: boolean
  }>()
  const ignoreAuthorization = location.state?.ignoreAuthorization
  const user = useUser()
  

  return <Route
      {...rest}
      render={({ location }) => {
        if(user === null) return <Redirect
        to={{
          pathname: "/login",
          state: { from: location }
        }}
      />
      if(ignoreAuthorization || !authorize || superUserPolicyEnhancer(authorize)(user, location.pathname)) return children
      return <Redirect
        to="/forbidden"
      />
      }}
    />
}

export default ProtectedRoute