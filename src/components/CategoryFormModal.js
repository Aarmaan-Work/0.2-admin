import React, { useState } from "react";
import "./CategoryFormModal.css"; // Import your CSS file

const CategoryFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: categoryName, image: categoryImage });
    setCategoryName("");
    setCategoryImage(null);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Category</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Category Name:
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </label>
          <label>
            Category Image:
            <input
              type="file"
              onChange={(e) => setCategoryImage(e.target.files[0])}
            />
          </label>
          <button type="submit" className="submit-button">
            Add Category
          </button>
          <button type="button" className="close-button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
