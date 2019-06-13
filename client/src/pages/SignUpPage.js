import React, { useState } from "react";
import { Link } from "react-router-dom";
import { queryApi, setAuthorizationHeaderToken } from "../services";
import icon from "../MessageApp-icon.svg";
import logo from "../MessageApp-logo.svg";
import authStyles from "./Auth.module.scss";

export default props => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const result = await queryApi(`
      mutation {
        createUser(email: "${email}", username: "${username}", 
                   profileImageUrl: "${profileImageUrl}" password: "${password}") {
          email,
          username,
          profileImageUrl,
          token
        }
        }
      `);

      if (result.errors) {
        const errorMessage = result.errors[0].message;
        setPassword("");
        setConfirmPassword("");

        alert(errorMessage);
      } else {
        localStorage.setItem("token", result.data.createUser.token);
        setAuthorizationHeaderToken(result.data.createUser.token);
        props.history.push("/lobby");
      }
    } catch (err) {
      const errorMessage = "That email is already registered";
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
        <button type="submit">Sign Up</button>
        <div className={authStyles.formGroup}>
          <label htmlFor="username">Username</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            name="email"
          />
        </div>
        <div className={authStyles.formGroup}>
          <label htmlFor="username">Email</label>
          <br />
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            name="email"
          />
        </div>
        <div className={authStyles.formGroup}>
          <label htmlFor="profileImageUrl">Profile Image Url</label>
          <br />
          <input
            type="text"
            value={profileImageUrl}
            onChange={e => setProfileImageUrl(e.target.value)}
            name="profileImageUrl"
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
        <div className={authStyles.formGroup}>
          <label htmlFor="confirm-password">Confirm Password</label>
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            name="confirm-password"
          />
        </div>
      </form>
      <p>
        Already a user? <Link to="/auth/login">Login</Link>
      </p>
    </div>
  );
};
