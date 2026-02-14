import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2" aria-label="Khatakit home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            fill="none"
            stroke="#1976B8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <path d="M20 4 L20 36" />
            <path d="M20 4 L6 7 L6 33 L20 36" />
            <path d="M20 4 L34 7 L34 33 L20 36" />
            <line x1="24" y1="14" x2="30" y2="14" />
            <line x1="24" y1="20" x2="30" y2="20" />
            <line x1="24" y1="26" x2="30" y2="26" />
          </svg>
          <span className="text-xl font-semibold tracking-tight">
            <span className="text-neutral-950">Khata</span>
            <span className="text-primary-600">kit</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                pathname === link.path
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span className="ml-2 hidden items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 sm:flex">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
            100% Private
          </span>
        </nav>
      </div>
    </header>
  );
}
