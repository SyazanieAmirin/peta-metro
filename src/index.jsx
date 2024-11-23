import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import Contact from './Contact/Contact';
import Content from './Content/Content';
import Admin from './Admin/Admin';
import NotFound404 from './NotFound404';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/:cityId" element={<Content />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound404 />} /> {/* Catch-all 404 */}
      </Routes>
    </Router>
  </React.StrictMode>
);
