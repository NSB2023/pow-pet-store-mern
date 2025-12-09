import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import './App.css';
import Cart from "./pages/Cart";
<Route path="/cart" element={<Cart />} />

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('petstoreUser');
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('petstoreUser', JSON.stringify(userData));

    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/'); // regular users go to home (or /shop if you prefer)
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('petstoreUser');
    navigate('/');
  };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/admin" element={<Admin user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
