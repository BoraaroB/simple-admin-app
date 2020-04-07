import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { sessionService } from '../../sessionServices/sessionServices';
import MainWrapper from '../../components/MainWrapper/MainWrapper';

export const PrivateLayout = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      return sessionService.isAuth() ?
        <MainWrapper>
          <Component {...props} />
        </MainWrapper>
        : <Redirect to='/login' />
      }}
    />
  )
}
