import { useNavigate } from "react-router-dom";
import styles from "./MainPage.module.css";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/auth";

type Film = {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
};

export default function MainPage() {
  const navigate = useNavigate();
  const { loggedIn, username, logout, _id } = useAuth();
  const [films, setFilms] = useState<Film[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const API_HOST = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_HOST}/films`)
      .then((res) => {
        setFilms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  }, [API_HOST]);

  const navigateToRegister = () => {
    navigate("/register");
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToProfile = () => {
    navigate(`/profile/${_id}`);
  };

  const filteredFilms = films.filter((film) =>
    film.title.toLocaleLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const detailedFilmInfo = (id: string) => {
    navigate(`/film/${id}`);
  };

  return (
    <div>
      <header className={styles.headerContainer}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/JustWatch_Logo.svg/2560px-JustWatch_Logo.svg.png"
          alt=""
        />

        <div className={styles.headerSearchBar}>
          <input
            type="text"
            id="searchBar"
            placeholder="Search film"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label htmlFor="searchBar">
            <FaSearch />
          </label>
        </div>
        {loggedIn ? (
          <div className={styles.profileContainer}>
            <div className={styles.profilePicture}>
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt=""
              />
              <p onClick={navigateToProfile}>{username}</p>
            </div>
            <button onClick={logout}>Log Out</button>
          </div>
        ) : (
          <div className={styles.headerButtonsContainer}>
            <button onClick={navigateToRegister}>Register</button>
            <button onClick={navigateToLogin}>Sign In</button>
          </div>
        )}
      </header>
      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p className={styles.loaderText}>
            „Films are loading, try refreshing the page if it takes too long.“
          </p>
        </div>
      ) : (
        <div className={styles.filmsContainer}>
          {filteredFilms.map((item) => (
            <div className={styles.filmsCards} key={item._id}>
              <img
                src={item.posterUrl}
                alt={item.title}
                className={styles.imagineDarken}
                onClick={() => detailedFilmInfo(item._id)}
              />
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      )}

      <footer>
        <p>© JustWatch | DMCA (Copyright) / Copyright representatives</p>
        <button onClick={scrollToTop}>^</button>
      </footer>
    </div>
  );
}
