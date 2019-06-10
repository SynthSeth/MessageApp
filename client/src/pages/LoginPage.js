import React, { useState } from "react";
import { Link } from "react-router-dom";
import { queryApi, setAuthorizationHeaderToken } from "../services";
import logo from "../MessageApp-logo.svg";

export default props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const result = await queryApi(`
      mutation {
        login(email: "${email}", password: "${password}") {
          email,
          token
        }
        }
      `);

      if (result.errors) {
        const errorMessage = result.errors[0].message;
        setEmail("");
        setPassword("");

        alert(errorMessage);
      } else {
        localStorage.setItem("token", result.data.login.token);
        props.history.push("/lobby");
      }
    } catch (err) {
      const errorMessage = "That email is not registered to any user";
      alert(errorMessage);
    }
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
          value={email}
          onChange={e => setEmail(e.target.value)}
          name="email"
        />
        <label htmlFor="password">Password</label>
        <input
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
          name="password"
        />
      </form>
      <p>
        or<Link to="/auth/signup">Sign Up</Link>
      </p>
    </>
  );
};
