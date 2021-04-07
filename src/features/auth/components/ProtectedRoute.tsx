import React from 'react'
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router';
import { getIsAuthenticated } from '../selectors/inputSelectors';

type Props = {
  children: React.ReactNode
} & RouteProps
export const ProtectedRoute = ({ children, ...rest }: Props) => {
  const isAuthenticated = useSelector(getIsAuthenticated)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
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