import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material/styles';
// import theme from './theme';
import React from 'react';
import { CssVarsProvider } from '@mui/joy/styles/CssVarsProvider';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from './layouts/MainLayout';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import HotelDetailPage from './pages/HotelDetailPage';
import { loaderHotel, loaderHotels } from './utils/loader';
import LoadingScreen from './components/LoadingScreen';
import SearchPage from './pages/SearchPage';
import mergedTheme from './theme';

import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
import HelpCenterPage from './pages/HelpCenterPage';

/**
 * @ check admin show admin in header
 */

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/search',
        loader: loaderHotels,
        element: <SearchPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/account',
        element: <AccountPage />,
      },
      {
        path: '/hotel/:hotelId',
        element: <HotelDetailPage />,
        loader: loaderHotel,
        errorElement: <NotFoundPage />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/helpcenter',
        element: <HelpCenterPage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <CssVarsProvider theme={mergedTheme}>
        <CssBaseline />
        <React.Suspense fallback={<LoadingScreen />}>
          <RouterProvider router={router} />
        </React.Suspense>
      </CssVarsProvider>
    </>
  );
}

export default App;
