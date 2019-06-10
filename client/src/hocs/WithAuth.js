import React from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import jwtDecode from "jwt-decode";

export default ({ ProtectedComponent }) => (
  <>
    <Switch>
      <PrivateRoute exact path={["/lobby", "/"]} component={ProtectedComponent} />
      <Route path={["/auth/login", "/auth/signup"]} component={AuthMenu} />
      <NotFound />
    </Switch>
  </>
);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <>
      <Route
        {...rest}
        render={props =>
          isAuthenticated() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/auth/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    </>
  );
}

const AuthMenu = () => (
  <>
    <Switch>
      {isAuthenticated() ? (
        <Redirect to="/lobby" />
      ) : (
        <>
          <Route exact path="/auth/login" component={LoginPage} />
          <Route exact path="/auth/signup" component={SignUpPage} />
        </>
      )}
    </Switch>
  </>
);

const NotFound = props => {
  return (
    <div>
      <h1>Page does not exist</h1>
      <Link to="/lobby">Go back</Link>
    </div>
  );
};

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
