// OrderList.js

import React, { useState } from "react";
import "./OrderList.css";

const OrderList = ({ orders, onSelectOrder }) => {
  const [activeTab, setActiveTab] = useState("New");

  // Filter orders based on the active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "New") return order.status === "order_placed";
    if (activeTab === "Preparing") return order.status === "preparing";
    if (activeTab === "Delivering") return order.status === "delivering";
    return true;
  });

  return (
    <div className="order-list">
      <h2>Order List</h2>

      {/* Tab buttons */}
      <div className="tabs">
        {["New", "Preparing", "Delivering"].map((status) => (
          <button
            key={status}
            className={`tab-button ${activeTab === status ? "active" : ""}`}
            onClick={() => setActiveTab(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Display filtered orders */}
      {filteredOrders.length === 0 ? (
        <p>No orders available.</p> // Message when there are no orders in the selected tab
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order.id}
            className="order-card"
            onClick={() => onSelectOrder(order)}
          >
            <h3>{order.orderNumber}</h3>
            <p>{order.deliveryTime}</p>
            <p className="order-price">£{order.totalPrice.toFixed(2)}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;
