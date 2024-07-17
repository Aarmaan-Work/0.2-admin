import React, { useState, useEffect } from "react";
import { database } from "../api/Appwrite";
import CategoryList from "../components/CategoryList";
import CategoryFormModal from "../components/CategoryFormModal";
import ProductCard from "../components/ProductCard";
import "./MenuPage.css";

const testProducts = [
  {
    id: 1,
    image: "https://via.placeholder.com/150",
    title: "Product 1",
    description: "Description for Product 1",
    cost: 29.99,
  },
  {
    id: 2,
    image: "https://via.placeholder.com/150",
    title: "Product 2",
    description: "Description for Product 2",
    cost: 39.99,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/150",
    title: "Product 3",
    description: "Description for Product 3",
    cost: 49.99,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/150",
    title: "Product 3",
    description: "Description for Product 3",
    cost: 49.99,
  },
];

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [categoryData, setCategoryData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const result = await database.listDocuments(
          "660bd50069d33a8c5123",
          "categories"
        );
        setCategoryData(result.documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleAddCategoryClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCategorySubmit = async (newCategory) => {
    try {
      const result = await database.createCategory(
        newCategory.name,
        newCategory.image
      );
      setCategoryData([...categoryData, result]);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="menu-page">
      <div className="category-section">
        <button onClick={handleAddCategoryClick}>Add New Category</button>
        <CategoryList
          categories={categoryData}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>
      <div className="product-list">
        {testProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCategorySubmit}
      />
    </div>
  );
};

export default MenuPage;
