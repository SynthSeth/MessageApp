import React from "react";
import { Link } from "react-router-dom";
import logo from "../MessageApp-logo.svg";

export default (props) => {
  return (
  <>
    <h1>MessageApp</h1>
    <img src={logo} alt="MessageApp's logo"/>
    <Link to="/auth/login">Login here</Link>
  </>
  )
}