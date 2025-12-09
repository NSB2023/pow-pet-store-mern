import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const API_BASE_URL = 'http://localhost:5050';

function Admin({ user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadProducts();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <section className="admin-page">
        <div className="admin-card">
          <h1>Admin Access Required</h1>
          <p>You must be logged in as an admin to view this page.</p>
          <Link to="/login" className="btn-primary admin-login-link">
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-card">
        <h1>Admin Dashboard</h1>
        <p className="admin-sub">
          Welcome, <strong>{user.name}</strong> ({user.email})
        </p>

        <div className="admin-summary">
          <div className="admin-summary-item">
            <span className="admin-summary-label">Total Products</span>
            <span className="admin-summary-value">{products.length}</span>
          </div>
        </div>

        <h2 className="admin-table-title">Product List</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="admin-note">
          This is a demo admin dashboard (data from backend API). You can later
          add product create/edit/delete functionality here.
        </p>
      </div>
    </section>
  );
}

export default Admin;
