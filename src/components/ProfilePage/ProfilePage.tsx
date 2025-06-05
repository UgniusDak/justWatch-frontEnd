import { useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import { FaUser, FaStar } from "react-icons/fa";
import { useAuth } from "../auth/auth";
import axios from "axios";
import { useEffect, useState } from "react";

type userComments = {
  username: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  content: string;
  starRating: number;
  timestamp: string;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { username, _id } = useAuth();
  const [userComments, setUserComments] = useState<userComments[]>([]);
  const API_HOST = import.meta.env.VITE_API_HOST;

  const navigateToMainPage = () => {
    navigate("/");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!_id) return;
    axios
      .get(`${API_HOST}/user/comments/${_id}`)
      .then((res) => {
        setUserComments(res.data);
      })
      .catch((err) => console.log(err));
  }, [_id, API_HOST]);

  return (
    <div className={styles.background}>
      <header className={styles.headerContainer}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/JustWatch_Logo.svg/2560px-JustWatch_Logo.svg.png"
          alt="JustWatch Logo"
        />
        <div className={styles.headerTitle}>
          <FaUser />
          <p>Profile Information</p>
        </div>
        <button onClick={navigateToMainPage}>Back to Main Page</button>
      </header>

      <div className={styles.profileContainer}>
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          alt="Profile"
        />
        <p className={styles.profileUsername}>{username}</p>

        {userComments.length > 0 ? (
          <>
            <p className={styles.sectionTitle}>My comments:</p>
            {userComments.map((comment, index) => (
              <div className={styles.profileCommentsContainer} key={index}>
                <div className={styles.profileCommentsHeader}>
                  <p>{comment.movieTitle}</p>
                  <p>{comment.timestamp.slice(11, 19)}</p>
                </div>
                <p>{comment.content}</p>
                <div className={styles.profileCommentsRating}>
                  <FaStar className={styles.faStar} />
                  <p>Rating: {comment.starRating}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p
            style={{
              textAlign: "center",
              marginTop: "2rem",
              color: "lightgray",
            }}
          >
            You currently have no comments.
          </p>
        )}
      </div>
      <footer className={styles.footer}>
        <p>© JustWatch | DMCA (Copyright) / Copyright representatives</p>
        <button onClick={scrollToTop} className={styles.scrollTopButton}>
          ^
        </button>
      </footer>
    </div>
  );
}
