
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Product from './pages/Product';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Login from './pages/Login';

import { ToastProvider } from './context/ToastContext';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/product" element={<Product />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
