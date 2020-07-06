import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { OrderDetail } from '../components';
export const OrderDetailRoutes = () => {
  return (
    <Switch>
      <Route exact path="/orderdetail" component={OrderDetail} />
    </Switch>
  );
};
