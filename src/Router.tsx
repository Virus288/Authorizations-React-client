import { Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import LoginWithCode from './pages/LoginWithCode';

const Router: React.FC = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LoginWithCode />} />
    </Routes>
  );
};

export default Router;
