import React, { useState } from "react";
import "./OrderList.css";

const OrderList = ({ orders, onSelectOrder }) => {
  const [activeTab, setActiveTab] = useState("New");

  return (
    <div className="order-list">
      <h2>Task List</h2>

      {/* Tab buttons for display only (no filtering) */}
      <div className="tabs">
        {["New", "Preparing", "Delivery"].map((status) => (
          <button
            key={status}
            className={`tab-button ${activeTab === status ? "active" : ""}`}
            onClick={() => setActiveTab(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Display all orders without filtering */}
      {orders.map((order) => (
        <div
          key={order.id}
          className="order-card"
          onClick={() => onSelectOrder(order)}
        >
          <h3>{order.orderNumber}</h3>
          <p>{order.deliveryTime}</p>
          <p className="order-price">£{order.totalPrice.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
