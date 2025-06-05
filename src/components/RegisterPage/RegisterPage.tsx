import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const API_HOST = import.meta.env.VITE_API_HOST;

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToMainPage = () => {
    navigate("/");
  };

  async function createUserAccount() {
    const body = {
      username,
      password,
    };

    try {
      const response = await axios.post(`${API_HOST}/register`, body);

      setUsername("");
      setPassword("");

      if (response.status === 201 || response.status === 200) {
        setIsRegistered(true);
        setErrorMessage("");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.error);
      }
    }
  }

  return (
    <div className={styles.test}>
      <header className={styles.headerContainer}>
        <img
          onClick={navigateToMainPage}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/JustWatch_Logo.svg/2560px-JustWatch_Logo.svg.png"
          alt=""
        />
        <button onClick={navigateToLogin}>Sign In</button>
      </header>
      <div className={styles.registerContainer}>
        <p>Get Started</p>
        <div className={styles.registerForm}>
          <label htmlFor="">Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.registerSubmitContainer}>
            {isRegistered && (
              <div className={styles.registered}>
                <p>You have registered successfully!!!</p>
              </div>
            )}
            <p className={styles.error}>{errorMessage}</p>
            <button onClick={createUserAccount}>Register</button>
            <p>
              This page is protected by Google reCAPTCHA to ensure you're not a
              bot.
            </p>
            <p>
              The information collected by Google reCAPTCHA is subject to the
              Google Privacy Policy and Terms of Service, and is used for
              providing, maintaining, and improving the reCAPTCHA service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
