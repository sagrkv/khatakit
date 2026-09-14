import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';
import { PUBLISHER, REPO_URL } from '../../seo/site';
export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link to="/" aria-label="Khatakit home">
          <Logo />
        </Link>
        <nav aria-label="Footer">
          <Link to="/">All tools</Link>
          <Link to="/about">About & privacy</Link>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            Source code on GitHub ↗
          </a>
        </nav>
        <div className="footer-meta">
          <span>For estimates. Check the applicable rules.</span>
          <a href={PUBLISHER.url} target="_blank" rel="noopener noreferrer">
            A filtercoffee.dev project ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
