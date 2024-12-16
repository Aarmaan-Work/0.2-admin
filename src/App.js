// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/Home";
import MenuPage from "./pages/Menu";
import CreateProduct from "./pages/CreateProduct";
import LiveOrders from "./pages/LiveOrders";
import OffersPage from "./pages/OffersPage";
import OfferCreationPage from "./pages/OfferCreationPage";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Menu" element={<MenuPage />} />
            <Route
              path="/Menu/create-product/:categoryID"
              element={<CreateProduct />}
            />
            <Route path="/Live-Orders" element={<LiveOrders />} />
            <Route path="/Offers-Page" element={<OffersPage />} />
            <Route path="/Offer-Creation" element={<OfferCreationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
