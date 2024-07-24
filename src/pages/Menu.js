import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryList from "../components/CategoryList";
import CategoryFormModal from "../components/CategoryFormModal";
import ProductCard from "../components/ProductCard";
import { loadCategories, loadProductsByCategory } from "../api/Appwrite";
import "./MenuPage.css";

const MenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await loadCategories();
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].category_id); // Use category_id here
        fetchProducts(categoriesData[0].category_id); // Use category_id here
      }
    } catch (error) {
      console.log("Error fetching categories: ", error);
    }
  };

  const fetchProducts = async (categoryId) => {
    try {
      const productsData = await loadProductsByCategory(categoryId);
      setProducts(productsData);
    } catch (error) {
      console.log("Error fetching products: ", error);
    }
  };

  const handleAddCategoryClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
  };

  return (
    <div className="menu-page">
      <div className="category-section">
        <button onClick={handleAddCategoryClick}>Add New Category</button>
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>
      <div className="product-section">
        <h1 className="category-title">
          {selectedCategory
            ? categories.find((cat) => cat.category_id === selectedCategory)
                ?.name
            : "Select a Category"}
        </h1>
        {selectedCategory && (
          <Link
            to={`/Menu/create-product/${selectedCategory}`}
            className="add-product-button"
          >
            Add New Product
          </Link>
        )}
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))
          ) : (
            <p>No products available for this category.</p>
          )}
        </div>
      </div>
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        loading={loading}
      />
    </div>
  );
};

export default MenuPage;
