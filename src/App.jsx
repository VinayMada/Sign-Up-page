import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import PostVerification from './components/PostVerification';
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/post-verification" element={<PostVerification />} />
      </Routes>
    </Router>
  );
}
