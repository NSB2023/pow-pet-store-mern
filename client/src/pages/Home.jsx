import { useCart } from "../context/CartContext";

import { useEffect, useState } from 'react';
import './Home.css';

import heroImg from '../assets/images/hero.png';
import ropeImg from '../assets/images/rope.png';
import collarImg from '../assets/images/collar.png';
import bedImg from '../assets/images/bed.png';
import perchImg from '../assets/images/perch.png';
import gravelImg from '../assets/images/gravel.png';
import planterImg from '../assets/images/planter.png';
import bowlImg from '../assets/images/bowl.png';
import postImg from '../assets/images/post.png';
import harnessImg from '../assets/images/harness.png';
import seedImg from '../assets/images/seed.png';
import tankImg from '../assets/images/tank.png';
import filterImg from '../assets/images/filter.png';
import indoorImg from '../assets/images/indoor.png';
import potImg from '../assets/images/pot.png';

const API_BASE_URL = 'http://localhost:5050';

// Map product id -> image
const productImages = {
  1: ropeImg,
  2: collarImg,
  3: bedImg,
  4: perchImg,
  5: gravelImg,
  6: planterImg,
  7: harnessImg,
  8: postImg,
  9: bowlImg,
  10: seedImg,
  11: perchImg,
  12: filterImg,
  13: tankImg,
  14: tankImg,
  15: indoorImg,
  16: potImg,
};

const formatPrice = (price) => `$${price.toFixed(2)}`;

function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load products right now.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const popularProducts = products.filter((p) => p.category === 'popular');
  const catDogProducts = products.filter((p) => p.category === 'cat-dog');
  const birdProducts = products.filter((p) => p.category === 'bird');
  const fishProducts = products.filter((p) => p.category === 'fish');
  const treeProducts = products.filter((p) => p.category === 'tree');

  const renderProductCard = (item) => (
    <div className="product-card" key={item.id}>
      <div className="card-image-wrapper">
        {productImages[item.id] ? (
          <img src={productImages[item.id]} alt={item.name} className="card-image" />
        ) : (
          <div className="card-image-placeholder">🐾</div>
        )}
      </div>

      <div className="card-body">
        <p className="product-name">{item.name}</p>
        {item.tag && <p className="product-tag">{item.tag}</p>}
        <p className="product-price">{formatPrice(item.price)}</p>
        <button className="card-btn" onClick={() => {
           addToCart({
           id: item.id,
           name: item.name,
           price: item.price,
           img: productImages[item.id]});window.dispatchEvent(new Event("open-cart"));}}> Add to Cart</button>
      </div>
    </div>
  );

  return (
    <div className="home-page">

      {/* ===== HERO SECTION ===== */}
      <section
        className="hero-banner"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay">
          <p className="hero-tag">PET ACCESSORIES STORE</p>

          <h1 className="hero-title">
            Find the Best Accessories
            <br />
            for Your Pet
          </h1>

          <p className="hero-subtitle">
            Shop curated picks for dogs, cats, birds, fish tanks, and indoor plants — 
            everything your pet’s corner needs in one clean, modern store.
          </p>

          <div className="hero-actions">
            <button className="btn-primary">Shop Now</button>
            <button className="btn-outline">Browse Collections</button>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT SECTIONS ===== */}
      <section className="section">
        <div className="section-header">
          <h2>Popular Products</h2>
          <p>Trending accessories across all pet categories.</p>
        </div>
        {loading ? (
          <p className="section-status">Loading…</p>
        ) : error ? (
          <p className="section-status section-error">{error}</p>
        ) : (
          <div className="product-grid">{popularProducts.map(renderProductCard)}</div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Cat & Dog Essentials</h2>
          <p>Harnesses, collars, beds, and more for your furry friends.</p>
        </div>
        <div className="product-grid">{catDogProducts.map(renderProductCard)}</div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Bird Corner</h2>
          <p>Perches, toys, and seed mix for happy birds.</p>
        </div>
        <div className="product-grid">{birdProducts.map(renderProductCard)}</div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Fish & Aquarium</h2>
          <p>Filters, gravel, and lighting for a calm aquatic setup.</p>
        </div>
        <div className="product-grid">{fishProducts.map(renderProductCard)}</div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Tree & Indoor Greens</h2>
          <p>Pet-safe plants and decorative pots for cozy corners.</p>
        </div>
        <div className="product-grid">{treeProducts.map(renderProductCard)}</div>
      </section>

    </div>
  );
}

export default Home;
