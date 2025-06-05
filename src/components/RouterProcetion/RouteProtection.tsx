import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RouteProtection({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const API_HOST = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    axios
      .get(`${API_HOST}/loggedIn`, { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          setLoggedIn(true);
        } else {
          navigate("/login");
        }
      })
      .catch(() => {
        setLoggedIn(false);
        navigate("/login");
      });
  }, [navigate, API_HOST]);

  return <>{loggedIn ? children : null}</>;
}
