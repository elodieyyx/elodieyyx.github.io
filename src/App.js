import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import Loading from './pages/Loading/Loading';
import Home from './pages/Home/Home';
import Resume from './pages/Resume/Resume';
import CaptchaDemo from './pages/Captcha/Demo';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loading onFinish={() => setLoading(false)} />}
      {!loading && (
        <>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/captcha-demo" element={<CaptchaDemo />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;