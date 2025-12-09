import { NavLink, Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { useState, useEffect } from "react";
import './Navbar.css';

import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";  // ✅ Import drawer

function Navbar({ user, onLogout }) {
  const { cart } = useCart();
  const handleCartClick = () => {
  if (!user) {
    alert("Please log in to view your cart.");
    return;
    }
    setOpenCart(true);
  };

  // ✅ Cart drawer open/close state
  const [openCart, setOpenCart] = useState(false);

  // ✅ When a product is added → open drawer automatically
  useEffect(() => {
    const handler = () => setOpenCart(true);
    window.addEventListener("open-cart", handler);
    return () => window.removeEventListener("open-cart", handler);
  }, []);

  return (
    <>
      {/* ===== NAVBAR UI ===== */}
      <header className="navbar">
        <div className="navbar-inner">

          {/* Left – Logo */}
          <div className="nav-left">
            <div className="logo-pill">🐾</div>
            <span className="brand">POW</span>
          </div>

          {/* Center – Navigation Links */}
          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              Shop
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              Contact
            </NavLink>

            {user?.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Side */}
          <div className="nav-right">

            {/* Search */}
            <button className="icon-btn">
              <FiSearch />
              <span>Search</span>
            </button>

            {/* ======================= */}
            {/* 🛒 CART ICON WITH BADGE */}
            {/* ======================= */}
            <button 
              className="nav-cart"
              onClick={() => setOpenCart(true)}   // ✅ open drawer
            >
              <FiShoppingCart className="cart-icon" />
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <>
                <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
                <button className="icon-btn nav-logout-btn" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="icon-btn nav-login-btn">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ===================================== */}
      {/* CART DRAWER — slides in from the right */}
      {/* ===================================== */}
      <CartDrawer
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
      />
    </>
  );
}

export default Navbar;
