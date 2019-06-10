import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiCall, setAuthorizationHeaderToken } from "../services";
import logo from "../MessageApp-logo.svg";

export default props => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios({
      url: "http://localhost:8080/graphql",
      method: "post",
      data: {
        query: `
          query {
            users {
              username
            }
            }
          `
      }
    }).then(result => {
      console.log(result.data);
    });
  }

  return (
    <>
      <h1>MessageApp</h1>
      <img src={logo} alt="MessageApp's logo" />
      <form onSubmit={handleSubmit}>
        <button type="submit">Login</button>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          value={formData.email}
          onChange={handleChange}
          name="email"
        />
        <label htmlFor="password">Password</label>
        <input
          type="text"
          value={formData.password}
          onChange={handleChange}
          name="password"
        />
      </form>
      <p>
        or<Link to="/auth/signup">Sign Up</Link>
      </p>
    </>
  );
};
