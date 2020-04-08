import React, { useContext } from 'react';
import MicrosoftLogin from "react-microsoft-login";
import { useHistory } from 'react-router-dom';

import { userAPI } from '../../api/index';
import { sessionService } from '../../sessionServices/sessionServices';
import { LoginContext } from '../../context/loginContext';

const CLIENT_ID = '11549263-44ac-450a-baff-3564c224f844';
export default props => {

  const { setUser } = useContext(LoginContext);

  const history = useHistory();

  const authHandler = async (err, user) => {

    if (err) {
      alert(err);
      return;
    }
    try {
      const { data } = await userAPI.auth(user.authResponseWithAccessToken);
      if (data) {
        sessionService.create(data);
        setUser(data);
        history.push('/users');
      }
    } catch (err) {
      console.log('This is error mic login: ', err);
    }

  };

  return (
    <MicrosoftLogin clientId={CLIENT_ID} authCallback={authHandler} redirectUri="http://localhost:3000/login" />
  );
};