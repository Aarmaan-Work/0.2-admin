import React from "react";
import "./CategoryList.css";

const CategoryList = ({ categories, selectedCategory, onCategorySelect }) => {
  if (!categories) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="category-list">
      {categories.map((category) => (
        <div
          key={category.category_id} // Use category_id as the key
          className={`category-item ${
            category.category_id === selectedCategory ? "selected" : ""
          }`}
          onClick={() => onCategorySelect(category.category_id)} // Use category_id
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
