import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { sessionService } from '../../sessionServices/sessionServices';

export const PublicLayout = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      return !sessionService.isAuth() ?
        <Component {...props} />
        : <Redirect to='/users' />
    }}
    />

  )
}

export default PublicLayout;
