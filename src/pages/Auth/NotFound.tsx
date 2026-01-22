import notFoundLogo from "../../assets/not-found-logo.svg";
import homeIcon from "../../assets/home-icon.svg";
import { Link } from "react-router";
import "../styles/NotFound.scss";

const NotFound = () => {
  return (
    <div className="not-found-page-wrapper">
      <h1 className="not-found-title">404</h1>
      <img className="not-found-logo" src={notFoundLogo} alt="Not Found" />
      <h2 className="not-found-subtitle">Page Not Found</h2>
      <p className="not-found-text">
        Sorry, we couldn't find the page you're looking for. The link might be
        broken or the page may have been removed.
      </p>
      <Link to="/" className="go-home-button">
        <img src={homeIcon} alt="Go Home" />
        <span>Go to Home page</span>
      </Link>
    </div>
  );
};

export default NotFound;
