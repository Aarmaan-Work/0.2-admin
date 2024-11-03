// src/components/Sidebar/Sidebar.js
import React from "react";
import "./Sidebar.css"; // You can create this file for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/Menu">Menu</a>
        </li>
        <li>
          <a href="/Live-Orders">Orders</a>
        </li>
        <li>
          <a href="/page3">Page 3</a>
        </li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
