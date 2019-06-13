import React, { useState } from "react";
import { Link } from "react-router-dom";
import { queryApi, setAuthorizationHeaderToken } from "../services";
import icon from "../MessageApp-icon.svg";
import logo from "../MessageApp-logo.svg";
import authStyles from "./Auth.module.scss";

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
        setPassword("");

        alert(errorMessage);
      } else {
        localStorage.setItem("token", result.data.login.token);
        setAuthorizationHeaderToken(result.data.login.token);
        props.history.push("/lobby");
      }
    } catch (err) {
      const errorMessage = "That email is not registered to any user";
      alert(errorMessage);
    }
  }

  return (
    <div className={authStyles.layout}>
      <img
        src={logo}
        alt="MessageApp's logo"
        style={{ margin: "1.25rem", marginLeft: "4rem" }}
      />
      <img src={icon} alt="MessageApp's icon" />
      <form onSubmit={handleSubmit} className={authStyles.Form}>
        <button type="submit">Login</button>
        <div className={authStyles.formGroup}>
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            name="email"
          />
        </div>
        <div className={authStyles.formGroup}>
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            name="password"
          />
        </div>
      </form>
      <p>
        Or <Link to="/auth/signup">Sign Up</Link>
      </p>
    </div>
  );
};
