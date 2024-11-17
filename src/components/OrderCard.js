import React from "react";
import "./OrderCard.css";

const OrderCard = ({ order, onClick }) => {
  return (
    <div className="order-card" onClick={onClick}>
      <div className="order-details">
        <h2 className="order-title">Order ID: {order.id}</h2>
        <p className="order-description">User: {order.userName}</p>
        <p className="order-description">Delivery Time: {order.deliveryTime}</p>
        <p className="order-description">Total Items: {order.totalItems}</p>
      </div>
      <div className="order-cost-container">
        <p className="order-cost">Total: £{order.totalPrice}</p>
      </div>
    </div>
  );
};

export default OrderCard;
