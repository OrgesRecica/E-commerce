import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from './api/axios.js';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Cart from './pages/Cart.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Clients from './pages/Clients.jsx';
import News from './pages/News.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Admin from './pages/Admin.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import { useReveal, useScrollProgress } from './hooks/useReveal.js';
import { clearAuth, setAuthLoading, setCredentials } from './store/authSlice.js';

export default function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  useEffect(() => {
    let active = true;
    dispatch(setAuthLoading());
    api.get('/auth/me')
      .then(({ data }) => {
        if (active) dispatch(setCredentials(data));
      })
      .catch(() => {
        if (active) dispatch(clearAuth());
      });

    const onExpired = () => dispatch(clearAuth());
    window.addEventListener('auth:expired', onExpired);
    return () => {
      active = false;
      window.removeEventListener('auth:expired', onExpired);
    };
  }, [dispatch]);
  useReveal();
  useScrollProgress();

  return (
    <div className="flex flex-col min-h-screen relative">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 relative z-[2]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
