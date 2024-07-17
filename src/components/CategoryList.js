// src/components/CategoryList.js

import React from "react";
import "./CategoryList.css";

const CategoryList = ({ categories, selectedCategory, onCategorySelect }) => {
  if (!categories) {
    // Handle loading state or empty state if categories are null
    return <div>Loading categories...</div>; // Example: Show loading message
  }

  return (
    <div className="category-list">
      {categories.map((category) => (
        <div
          key={category.$id} // Assuming $id is the unique identifier from Appwrite
          className={`category-item ${
            category.$id === selectedCategory ? "selected" : ""
          }`}
          onClick={() => onCategorySelect(category.$id)}
        >
          {category.Name} {/* Adjust based on your actual document structure */}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
