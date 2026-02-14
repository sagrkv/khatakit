import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-800">
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-800"
            >
              About & Privacy
            </Link>
            <a
              href="https://github.com/sagrkv/khatakit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-800"
            >
              GitHub
            </a>
          </div>
          <p className="text-xs text-neutral-400">
            No data collected. No cookies. All calculations happen in your browser.
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} Khatakit. Free and open source. Not legal or financial
          advice.
        </p>
      </div>
    </footer>
  );
}
