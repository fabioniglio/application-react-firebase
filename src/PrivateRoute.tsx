import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps as ReactDOMRouteProps } from 'react-router';
import { AuthContext } from './AuthProvider';

interface RouteProps extends ReactDOMRouteProps {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<RouteProps> = ({
  component: RouteComponent,
  ...rest
}) => {
  const { authenticated, loadingAuthState } = useContext(AuthContext);

  if (loadingAuthState) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={routeProps =>
        authenticated ? (
          <RouteComponent />
        ) : (
          <Redirect
            to={{ pathname: '/auth/login', state: { prevPath: rest.path } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
