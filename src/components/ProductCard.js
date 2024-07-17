import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cost, setCost] = useState(product.cost);

  const handleCostChange = () => {
    setIsEditing(true);
  };

  const handleCostSubmit = (e) => {
    e.preventDefault();
    const newCost = parseFloat(e.target.cost.value);
    if (!isNaN(newCost)) {
      setCost(newCost);
    }
    setIsEditing(false);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} className="product-image" />
      <Link to={`/edit-product/${product.id}`} className="edit-product-button">
        Edit
      </Link>
      <div className="product-details">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-description">{product.description}</p>
      </div>
      <div className="product-cost-container">
        {isEditing ? (
          <form onSubmit={handleCostSubmit}>
            <input
              type="number"
              step="0.01"
              name="cost"
              defaultValue={cost}
              className="product-cost-input"
            />
            <button type="submit" className="save-cost-button">
              Save
            </button>
          </form>
        ) : (
          <>
            <p className="product-cost">Cost: £{cost.toFixed(2)}</p>
            <button onClick={handleCostChange} className="change-cost-button">
              Change Cost
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
