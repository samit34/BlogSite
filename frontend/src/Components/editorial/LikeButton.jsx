import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./editorial.css";

const LikeButton = ({
  count = 0,
  active = false,
  onClick,
  className = "",
  label,
}) => {
  const n = Array.isArray(count) ? count.length : Number(count) || 0;
  return (
    <button
      type="button"
      className={`sq-like${active ? " sq-like--on" : ""}${
        className ? ` ${className}` : ""
      }`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={label || (active ? `Unlike (${n})` : `Like (${n})`)}
    >
      {active ? <FaHeart aria-hidden /> : <FaRegHeart aria-hidden />}
      <span>{n}</span>
    </button>
  );
};

export default LikeButton;
