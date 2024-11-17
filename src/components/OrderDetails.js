import React, { useState, useEffect } from "react";
import "./OrderDetails.css";
import { updateOrderStatus } from "../api/Appwrite";

const OrderDetails = ({ order, onUpdateStatus }) => {
  const [preparingTime, setPreparingTime] = useState(25); // Initial time in minutes

  useEffect(() => {
    if (order.status !== "order_placed") {
      setPreparingTime(25); // Reset if it's not a new order
    }
  }, [order.status]);

  const handleStatusChange = async () => {
    let newStatus = "";
    if (order.status === "order_placed") {
      newStatus = "preparing";
    } else if (order.status === "preparing") {
      newStatus = "delivering";
    } else if (order.status === "delivering") {
      newStatus = "delivered";
    }

    if (newStatus) {
      await updateOrderStatus(order.id, newStatus); // Update in the database
      onUpdateStatus(order.id, newStatus); // Update locally in LiveOrders state
    }
  };

  const incrementTime = () => {
    if (order.status === "order_placed") {
      setPreparingTime((prev) => prev + 1);
    }
  };

  const decrementTime = () => {
    if (order.status === "order_placed" && preparingTime > 1) {
      setPreparingTime((prev) => prev - 1);
    }
  };

  return (
    <div className="order-details">
      <div className="order-header">
        <h2>
          {order.status === "order_placed"
            ? `New Order ${order.id}`
            : order.status === "preparing"
            ? `Order Preparing ${order.id}`
            : order.status === "delivering"
            ? `Delivering ${order.id}`
            : "Order"}
        </h2>
        {(order.status === "order_placed" ||
          order.status === "preparing" ||
          order.status === "delivering") && (
          <button className="accept-order-button" onClick={handleStatusChange}>
            {order.status === "order_placed"
              ? "Accept Order"
              : order.status === "preparing"
              ? "On Its Way"
              : order.status === "delivering"
              ? "Complete"
              : ""}
          </button>
        )}
      </div>

      <div className="order-info">
        <h3>Task info</h3>
        <div className="preparing-time">
          <p>Preparing time:</p>
          {order.status === "order_placed" ? (
            <>
              <button onClick={decrementTime} disabled={preparingTime <= 1}>
                -
              </button>
              <span>{preparingTime} min</span>
              <button onClick={incrementTime}>+</button>
            </>
          ) : (
            <span>{preparingTime} min</span>
          )}
        </div>
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
            <p>£{item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <h3>Total: £{order.totalPrice.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default OrderDetails;
