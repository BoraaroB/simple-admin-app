import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { PrivateLayout } from "./layout/PrivateLayout/PrivateLayout";
import { PublicLayout } from "./layout/PrivateLayout/PublicLayout";
import Login from "./pages/Login/Login";
import UsersPage from './pages/UsersPage/UsersPage';

const Routes = () => {
  return (
    <>
      <Switch>
        <PublicLayout exact path="/login" component={Login} />
        <PrivateLayout exact path="/users" component={UsersPage} />
        <Redirect to="/users" />
      </Switch>
    </>
  );
};

export default Routes;