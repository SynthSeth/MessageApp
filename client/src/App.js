import React from "react";
import logo from "./MessageApp-logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import WithAuth from "./hocs/WithAuth";
import LobbyPage from "./pages/Lobby";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <WithAuth ProtectedComponent={LobbyPage} />
      </Router>
    </div>
  );
}

export default App;
