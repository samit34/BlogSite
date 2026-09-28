import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { API_BASE_URL } from "../../api/client";
import { useBlog } from "../../Pages/Blogcontext";
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";
import { userHasLiked } from "../../utils/currentUser";
import { stripHeading } from "./fallbacks";
import "./editorial.css";

const LATEST_COUNT = 6;

const LatestBlogs = () => {
  const { blog, handleLike, toggleWishlist, isWished } = useBlog();

  const latest = Array.isArray(blog)
    ? [...blog]
        .sort((a, b) => {
          const da = parseInt(String(a?.date ?? ""), 10) || 0;
          const db = parseInt(String(b?.date ?? ""), 10) || 0;
          return db - da;
        })
        .slice(0, LATEST_COUNT)
    : [];

  if (latest.length === 0) return null;

  return (
    <section className="sq-latest" aria-label="Latest blog">
      <div className="sq-latest__head">
        <p className="sq-kicker">Just in</p>
        <h2 className="sq-display">Latest blog</h2>
        <Link className="sq-latest__all" to="/layout/blog">
          Full archive
        </Link>
      </div>
      <ul className="sq-latest__list">
        {latest.map((item, index) => (
          <li key={item._id || index} className="sq-latest__row">
            <Link
              to={`/layout/specificblog/${item._id}`}
              className="sq-latest__link"
            >
              <div className="sq-latest__thumb">
                <img
                  src={`${API_BASE_URL}/uploads/${item.image}`}
                  alt=""
                />
              </div>
              <div className="sq-latest__copy">
                <span>
                  {String(index + 1).padStart(2, "0")} · {item.category}
                </span>
                <h3
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      stripHeading(item.heading).slice(0, 90)
                    ),
                  }}
                />
                <em>
                  {item.username} ·{" "}
                  {new Date(parseInt(item.date)).toLocaleDateString()}
                </em>
              </div>
            </Link>
            <div className="sq-latest__tools">
              <LikeButton
                count={item.liked?.length}
                active={userHasLiked(item.liked)}
                onClick={() => handleLike(item._id)}
              />
              <SaveButton
                active={isWished(item._id)}
                onClick={() => toggleWishlist(item._id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LatestBlogs;
