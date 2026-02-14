import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/gst-late-fee-interest-calculator',
        lazy: () => import('./tools/gst-late-fee/GstLateFee'),
      },
      {
        path: '/advance-tax-calculator',
        lazy: () => import('./tools/advance-tax/AdvanceTax'),
      },
      {
        path: '/emi-calculator',
        lazy: () => import('./tools/emi/EmiCalculator'),
      },
      {
        path: '/presumptive-income-calculator',
        lazy: () => import('./tools/presumptive-tax/PresumptiveTax'),
      },
      { path: '/about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
