import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import FilmPage from "./components/FilmPage/FilmPage";
import { AuthProvider } from "./components/auth/auth";
import RouteProtection from "./components/RouterProcetion/RouteProtection";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profile/:id"
              element={
                <RouteProtection>
                  <ProfilePage />
                </RouteProtection>
              }
            />
            <Route path="/film/:id" element={<FilmPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
