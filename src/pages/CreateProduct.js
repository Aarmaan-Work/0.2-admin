import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateProduct.css";
// import { createProduct } from "../api/Appwrite";

const CreateProduct = () => {
  const { categoryID } = useParams(); // Extract categoryID from URL parameters
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    image: null,
    price: "",
    volume: "",
    categoryId: categoryID || "", // Initialize categoryId with URL parameter
  });

  useEffect(() => {
    if (!categoryID) {
      console.error("Category ID is missing.");
    }
  }, [categoryID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      image: e.target.files[0],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if categoryId is valid
    if (!product.categoryId) {
      console.error("Category ID is missing.");
      return;
    }

    const newProduct = {
      ...product,
      price: parseFloat(product.price),
      volume: parseFloat(product.volume),
    };

    try {
      // await createProduct(newProduct);
      console.log("Product created successfully");
      navigate("/Menu"); // Navigate to another page after creation
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="create-product-page">
      <h2>Create New Product</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Image:
          <input type="file" onChange={handleFileChange} required />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            step="0.01"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Volume:
          <input
            type="number"
            name="volume"
            step="0.01"
            value={product.volume}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
