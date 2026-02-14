import { Link } from 'react-router-dom';
import { SEO } from '../lib/utils/seo';

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found - Khatakit"
        description="The page you are looking for does not exist."
        path="/404"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center md:px-8">
        <p className="font-mono text-6xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-neutral-800">Page Not Found</h1>
        <p className="mt-2 text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}
