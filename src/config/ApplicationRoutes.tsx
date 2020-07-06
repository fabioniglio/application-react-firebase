import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { AuthRoutes } from '../views/Auth';
import PrivateRoute from '../PrivateRoute';
import { DashboardRoutes } from '../views/Dashboard';
import { OrderDetailRoutes } from '../views/OrderDetail';

const ApplicationRoutes = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/dashboard" component={DashboardRoutes} />
        <PrivateRoute exact path="/orderdetail" component={OrderDetailRoutes} />
        <Route path="/auth" component={AuthRoutes} />
        <Redirect to="/auth" from="/" />
      </Switch>
    </Router>
  );
};
export default ApplicationRoutes;
