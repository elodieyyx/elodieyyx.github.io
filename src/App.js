import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Loading from './pages/Loading/Loading';
import Home from './pages/Home/Home';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';

  return (
    <>
      {loading && <Loading onFinish={() => setLoading(false)} />}
      {!loading && (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;