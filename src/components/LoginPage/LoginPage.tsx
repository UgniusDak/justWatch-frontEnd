import { useNavigate } from "react-router-dom";
import styles from "../RegisterPage/RegisterPage.module.css";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "../auth/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const API_HOST = import.meta.env.VITE_API_HOST;

  const navigate = useNavigate();

  const navigateToMainPage = () => {
    navigate("/");
  };

  const { login } = useAuth();

  async function authenticateUser() {
    try {
      const body = {
        username,
        password,
      };

      const response = await axios.post(`${API_HOST}/login`, body, {
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        const { _id } = response.data;
        login(username, _id);
        navigate("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data); // Pažiūrėk, kas tiksliai yra response.data
        setError(error.response?.data.error || "Unknown error occurred");
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
      </header>
      <div className={styles.registerContainer}>
        <p>Sign In</p>
        <div className={styles.registerForm}>
          <label htmlFor="">Username</label>
          <input
            type="text"
            placeholder=" Username"
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
            <p className={styles.error}>{error}</p>
            <button onClick={authenticateUser}>Login</button>
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
