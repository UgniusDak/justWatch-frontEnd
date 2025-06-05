import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./FilmPage.module.css";
import { FaSearch, FaUser, FaStar } from "react-icons/fa";
import { useAuth } from "../auth/auth";
import { FaComment } from "react-icons/fa";

type Film = {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
};

type userComments = {
  username: string;
  userId: string;
  movieId: string;
  content: string;
  starRating: number;
  timestamp: string;
};

export default function FilmPage() {
  const { id } = useParams<{ id: string }>();
  const API_HOST = import.meta.env.VITE_API_HOST;
  const [film, setFilm] = useState<Film | null>(null);
  const { loggedIn, username, logout, _id } = useAuth();
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(-1);
  const [selected, setSelected] = useState(-1);
  const [userComments, setUserComments] = useState<userComments[]>([]);

  const navigate = useNavigate();

  const navigateToProfile = () => {
    navigate(`/profile/${_id}`);
  };

  const navigateToMainPage = () => {
    navigate("/");
  };

  useEffect(() => {
    axios
      .get(`${API_HOST}/film/${id}`)
      .then((res) => {
        setFilm(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, API_HOST]);

  useEffect(() => {
    axios.get(`${API_HOST}/comments/${id}`).then((res) => {
      setUserComments(res.data);
    });
  }, [id, API_HOST]);

  async function submitComment() {
    const body = {
      username,
      userId: _id,
      movieId: id,
      movieTitle: film?.title,
      content: comment,
      starRating: selected,
    };

    try {
      const response = await axios.post(`${API_HOST}/comments`, body);

      setUserComments((prevComments) => [...prevComments, response.data]);

      setComment("");
      setSelected(-1);
    } catch (error) {
      console.log("Failed to add comment", error);
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  async function deleteComment(commentToDelete: userComments) {
    try {
      await axios.delete(
        `${API_HOST}/comments/${commentToDelete.movieId}/${commentToDelete.userId}`
      );

      setUserComments((prevComments) =>
        prevComments.filter(
          (comment) =>
            !(
              comment.movieId === commentToDelete.movieId &&
              comment.userId === commentToDelete.userId &&
              comment.content === commentToDelete.content
            )
        )
      );
    } catch (error) {
      console.log("Failed to delete comment", error);
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

        <div className={styles.headerSearchBar}>
          <input type="text" id="searchBar" placeholder="Search film" />
          <label htmlFor="searchBar">
            <FaSearch />
          </label>
        </div>
        {loggedIn && (
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
        )}
      </header>
      <div className={styles.videoWithIcon}>
        <iframe
          src="https://www.youtube.com/embed/vKQi3bBA1y8"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/JustWatch_Logo.svg/2560px-JustWatch_Logo.svg.png"
          alt=""
        />
      </div>
      {film && (
        <div className={styles.filmContainer} key={film._id}>
          <img src={film.posterUrl} alt="" />
          <div className={styles.filmDetails}>
            <p className={styles.filmTitle}>{film.title}</p>
            <span>Description:</span>
            <p className={styles.filmDescription}>{film.description}</p>
            {Array(10)
              .fill("✮")
              .map((star, index) => (
                <span
                  key={index}
                  onMouseOver={() => setHovered(index)}
                  onMouseOut={() => setHovered(-1)}
                  onClick={() => setSelected(index)}
                  style={{
                    fontSize: "30px",
                    color:
                      index <= (hovered !== -1 ? hovered : selected)
                        ? "gold"
                        : "white",
                  }}
                >
                  {star}
                </span>
              ))}
          </div>
        </div>
      )}
      <div className={styles.commentsContainer}>
        <div className={styles.commentSection}>
          <div className={styles.commentFont}>
            <FaComment />
            <p>Comments</p>
          </div>
          {loggedIn && (
            <div className={styles.addComment}>
              <input
                type="text"
                placeholder="Write a comment....."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={submitComment}>Add Comment</button>
            </div>
          )}
        </div>
        {userComments.map((comment, index) => (
          <div className={styles.commentListContainer} key={index}>
            <div className={styles.commentList}>
              <div className={styles.commentListHeader}>
                <p>
                  {" "}
                  <FaUser />
                  {comment.username}
                </p>{" "}
                <p>{comment.timestamp.slice(11, 19)}</p>
              </div>
              {loggedIn && comment.userId === _id && (
                <div>
                  <button onClick={() => deleteComment(comment)}>
                    Delete Comment
                  </button>
                </div>
              )}
            </div>
            <div className={styles.commentFooter}>
              <p>{comment.content}</p>
              <div className={styles.commentRating}>
                <FaStar className={styles.faStar} />
                <p>Rating: {comment.starRating}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer>
        <p>© JustWatch | DMCA (Copyright) / Copyright representatives</p>
        <button onClick={scrollToTop}>^</button>
      </footer>
    </div>
  );
}
