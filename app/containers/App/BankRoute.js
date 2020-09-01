import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const BankRoute = ({ component: Component, ...rest }) => {
  function isLogin() {
    var token = localStorage.getItem('partnerLogged');
    console.log("route: "+token);
    if (!token || token == null || token == undefined || token == '') {
      return false;
    } else {
      return true;
    }
  }
  return (
    <Route
      {...rest}
      render={props =>
        isLogin() ? <Component {...props} {...rest} /> : <Redirect to="/" />
      }
    />
  );
};

export default BankRoute;
