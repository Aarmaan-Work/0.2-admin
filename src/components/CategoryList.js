// src/components/CategoryList.js

import React from "react";
import "./CategoryList.css";

const CategoryList = ({ categories, selectedCategory, onCategorySelect }) => {
  if (!categories) {
    return <div>Loading categories...</div>; // Handle loading state
  }

  return (
    <div className="category-list">
      {categories.map((category) => (
        <div
          key={category.category_id} // Ensure category_id is unique and correctly used
          className={`category-item ${
            category.category_id === selectedCategory ? "selected" : ""
          }`}
          onClick={() => onCategorySelect(category.category_id)}
        >
          {category.title} {/* Display the category title */}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
