import { useLocation } from 'react-router-dom';
import { findPage } from './pages';

/** The registry page for the current location. */
export function usePage() {
  const { pathname } = useLocation();
  return findPage(pathname);
}
