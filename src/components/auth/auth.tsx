import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type AuthContextType = {
  loggedIn: boolean;
  username: string;
  _id: string;
  logout: () => void;
  login: (username: string, userId: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  username: "",
  _id: "",
  logout: () => {},
  login: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const API_HOST = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    axios
      .get(`${API_HOST}/loggedIn`, { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          setLoggedIn(true);
          setUsername(res.data.username);
          setUserId(res.data._id);
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setUsername("");
        setUserId("");
      });
  }, []);

  const login = (username: string, userId: string) => {
    setLoggedIn(true);
    setUsername(username);
    setUserId(userId);
  };

  const logout = async () => {
    try {
      await axios.post(`${API_HOST}/logout`, {}, { withCredentials: true });
      setLoggedIn(false);
      setUsername("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, username, logout, login, _id: userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
