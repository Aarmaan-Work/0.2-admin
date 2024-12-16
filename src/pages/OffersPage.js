import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./OffersPage.css"; // Add basic styling

const OffersPage = () => {
  const templates = [
    {
      id: "percent_off",
      name: "% Off Total Basket",
      description: "Apply a percentage discount to the total basket value.",
    },
    {
      id: "buy_x_get_y_free",
      name: "Buy Something Get an Item for Free",
      description: "Buy a specific item and get another item for free.",
    },
    {
      id: "spend_x_get_free_delivery",
      name: "Free Delivery",
      description: "Offer free delivery for orders over a specified amount.",
    },
  ];

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Navigate to the Offer Creation Page with the selected template
  const navigateToOfferCreation = (templateId) => {
    navigate(`/Offer-Creation`, { state: { templateId } });
  };

  return (
    <div className="offers-page">
      <h1>Manage Offers</h1>
      <div className="templates-list">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <h3>{template.name}</h3>
            <p>{template.description}</p>
            <button onClick={() => navigateToOfferCreation(template.id)}>
              Create Offer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
