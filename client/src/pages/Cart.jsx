import "./Cart.css";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={item.image || item.img} alt={item.name} />

          <div className="cart-details">
            <h3>{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>

            <div className="qty-controls">
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

      {cart.length > 0 && (
        <div className="cart-total">
          <h2>Total: ${total.toFixed(2)}</h2>
          <button className="checkout-btn">Checkout</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
