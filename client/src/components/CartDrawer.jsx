import React from "react";
import "./CartDrawer.css";
import { useCart } from "../context/CartContext";

function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQty, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      {cart.length === 0 ? (
        <p className="empty-text">Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.img} alt={item.name} />

              <div className="cart-info">
                <h4>{item.name}</h4>
                <p>${item.price.toFixed(2)}</p>

                <div className="qty-box">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>

                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-footer">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button className="checkout-btn">Place Order</button>
      </div>
    </div>
  );
}

export default CartDrawer;
