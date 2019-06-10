import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import jwtDecode from "jwt-decode";

export default ({ ProtectedComponent }) => (
  <>{isAuthenticated() ? <ProtectedComponent /> : <AuthMenu />}</>
);

const AuthMenu = () => (
  <>
    <Switch>
      <Route exact path="/auth/login" component={LoginPage} />
      <Route exact path="/auth/signup" component={SignUpPage} />
      <Redirect to="/auth/login"/>
    </Switch>
  </>
);

function isAuthenticated() {
  try {
    const token = localStorage.token;
    if (jwtDecode(token)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    localStorage.clear();
    return false;
  }
}
