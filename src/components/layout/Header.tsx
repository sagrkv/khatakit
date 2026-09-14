import { Link, useLocation } from 'react-router-dom';
import Logo from '../brand/Logo';
export default function Header() {
  const { pathname } = useLocation();
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand" aria-label="Khatakit home">
          <Logo />
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/" aria-current={pathname === '/' ? 'page' : undefined}>
            Tools
          </Link>
          <Link to="/about" aria-current={pathname === '/about' ? 'page' : undefined}>
            About
          </Link>
        </nav>
        <span className="header-note">
          <span aria-hidden="true" />
          Free · No account required
        </span>
      </div>
    </header>
  );
}
