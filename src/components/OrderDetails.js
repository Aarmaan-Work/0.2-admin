import React from "react";
import "./OrderDetails.css";

const OrderDetails = ({ order }) => {
  return (
    <div className="order-details">
      <div className="order-header">
        <h2>{order.status}</h2>
        <p>Order execution starts automatically</p>
        <p>Manager - Anna</p>
      </div>

      <div className="order-info">
        <h3>Task info</h3>
        <p>Preparing time: 00h : 25m : 30s</p>
        <p>Address: {order.address}</p>
        <p>Contact: {order.contact}</p>
      </div>

      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <img src={item.image_uri} alt={item.name} className="item-image" />
            <p>{item.name}</p>
            <p>x{item.quantity}</p>
            <p>{item.description}</p>
            <p>€{item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <h3>Total: €{order.totalPrice.toFixed(2)}</h3>
        <button className="accept-order-button">Accept order</button>
      </div>
    </div>
  );
};

export default OrderDetails;
