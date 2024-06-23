import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './pages/Authentication/register/Register';
import { NapoleaoGameOnline } from './pages/NapoleaoGameOnline/NapoleaoGameOnline';
import Login from './pages/Authentication/login/Login';
import { NapoleaoGame } from './pages/NapoleaoGame/NapoleaoGame';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import ChooseLobby from './pages/ChooseLobby/ChooseLobby';
import Logout from './pages/Authentication/Logout';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'register',
    element: <Register />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'logout',
    element: <Logout />,
  },
  {
    path: 'online-game',
    element: <ChooseLobby />,
    children: [
      {
        path: 'lobby/:lobbyId',
        element: <NapoleaoGameOnline />,
      },
    ],
  },
  {
    path: 'lobby/:lobbyId',
    element: <NapoleaoGameOnline />,
  },
  {
    path: 'game',
    element: <NapoleaoGame />,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
