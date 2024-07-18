import React, { useState, useEffect } from "react";
import CategoryList from "../components/CategoryList";
import CategoryFormModal from "../components/CategoryFormModal";
import ProductCard from "../components/ProductCard";
import {
  loadCategories,
  createCategory,
  loadCategoryProducts,
} from "../api/Appwrite";
import "./MenuPage.css";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categories = await loadCategories();
      setCategoryData(categories);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].title);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProducts = async (categoryId) => {
    try {
      setLoading(true);
      const products = await loadCategoryProducts(categoryId);
      setProductData(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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
      setLoading(true);
      const result = await createCategory(newCategory.name, newCategory.image);
      setCategoryData((prevCategoryData) => [...prevCategoryData, result]);
      setIsModalOpen(false);
      console.log("Category added successfully:", result);
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
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
          loading={loading}
        />
      </div>
      <div className="product-list">
        {productData.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCategorySubmit}
        loading={loading}
      />
    </div>
  );
};

export default MenuPage;
