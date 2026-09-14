import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';
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
          <a href="https://github.com/sagrkv/khatakit" target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </nav>
        <span>For estimates. Check the applicable rules.</span>
      </div>
    </footer>
  );
}
