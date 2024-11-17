// LiveOrders.js

import React, { useState, useEffect } from "react";
import OrderList from "../components/OrderList";
import OrderDetails from "../components/OrderDetails";
import { loadLiveOrders, updateOrderStatus } from "../api/Appwrite";
import "./LiveOrders.css";

const LiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    const result = await loadLiveOrders();

    if (result) {
      const formattedOrders = result.documents
        .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
        .map((doc) => ({
          id: doc.$id,
          orderNumber: `Order ${doc.$id}`,
          userName: "User",
          totalItems: JSON.parse(doc.items).length,
          totalPrice: doc.totalCost,
          deliveryTime: new Date(
            new Date(doc.$createdAt).getTime() + 30 * 60 * 1000
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: doc.status,
          address: doc.address,
          items: JSON.parse(doc.items),
          contact: "+424 56778912",
        }));
      setOrders(formattedOrders);
      setSelectedOrder(null);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatusInList = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setSelectedOrder(null);
  };

  return (
    <div className="live-orders">
      <OrderList orders={orders} onSelectOrder={setSelectedOrder} />
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onUpdateStatus={updateOrderStatusInList}
        />
      )}
    </div>
  );
};

export default LiveOrders;
