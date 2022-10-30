import React from 'react';
// import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Bookmark from './views/Bookmark';
import Home from './views/Home';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookmark" element={<Bookmark />} />
        <Route path="*" element={<Navigate to={'/'} replace />} />
      </Routes>
    </>
  );
}

export default App;
