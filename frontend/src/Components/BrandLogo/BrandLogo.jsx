import { Link } from "react-router-dom";
import "./BrandLogo.css";

const BrandLogo = ({
  to = "/",
  invert = false,
  withTagline = true,
  size = "md",
  className = "",
}) => {
  return (
    <Link
      to={to}
      className={`brand-logo brand-logo--${size}${
        invert ? " brand-logo--invert" : ""
      }${className ? ` ${className}` : ""}`}
      aria-label="Chronic home"
    >
      <span className="brand-logo__mark" aria-hidden>
        <span className="brand-logo__inner">
          <span className="brand-logo__c">C</span>
        </span>
      </span>
      <span className="brand-logo__text">
        <span className="brand-logo__name">
          Chron<em>ic</em>
        </span>
        {withTagline ? (
          <span className="brand-logo__tag">Independent magazine</span>
        ) : null}
      </span>
    </Link>
  );
};

export default BrandLogo;
