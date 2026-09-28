import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import "./editorial.css";

const SaveButton = ({ active = false, onClick, className = "", label }) => {
  return (
    <button
      type="button"
      className={`sq-story__save${active ? " sq-story__save--on" : ""}${
        className ? ` ${className}` : ""
      }`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={
        label || (active ? "Remove from wishlist" : "Save to wishlist")
      }
    >
      {active ? <FaBookmark aria-hidden /> : <FaRegBookmark aria-hidden />}
    </button>
  );
};

export default SaveButton;
