import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OfferCreationPage.css";
import { CreateOffers, loadProducts } from "../api/Appwrite";

const templates = {
  percent_off: {
    id: "percent_off",
    name: "% Off Total Basket",
    description: "Apply a percentage discount to the total basket value.",
    config_schema: {
      discountRate: { type: "number", label: "Discount Percentage (%)" },
    },
  },
  buy_x_get_y_free: {
    id: "buy_x_get_y_free",
    name: "Buy Something Get an Item for Free",
    description: "Buy a specific item and get another item for free.",
    config_schema: {
      requiredItemId: { type: "search", label: "Items User Can Buy" },
      freeItemId: { type: "search", label: "Items User Gets for Free" },
    },
  },
  spend_x_get_free_delivery: {
    id: "spend_x_get_free_delivery",
    name: "Free Delivery",
    description: "Get a free delivery when you spend over £30",
    config_schema: {
      minimumSpend: {
        type: "number",
        label: "How much does the user have to spend",
      },
      discountRate: { type: "number", label: "Discount Percentage (%)" },
    },
  },
  // Add other templates here...
};

const OfferCreationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { templateId } = location.state || {};
  const selectedTemplate = templates[templateId];

  const [offerConfig, setOfferConfig] = useState({});
  const [offerStart, setOfferStart] = useState("");
  const [offerEnd, setOfferEnd] = useState("");

  const [requiredSearchQuery, setRequiredSearchQuery] = useState("");
  const [freeSearchQuery, setFreeSearchQuery] = useState("");
  const [selectedRequiredItems, setSelectedRequiredItems] = useState([]);
  const [selectedFreeItems, setSelectedFreeItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);

  useEffect(() => {
    if (templateId === "buy_x_get_y_free") {
      const fetchProducts = async () => {
        try {
          const productNames = await loadProducts();

          // Correct mapping: Ensure you are using the right field for ID and Name
          setAvailableItems(
            productNames.map((product) => ({
              id: product.id, // Use product.id instead of product.$id
              name: product.name, // Access the name directly
            }))
          );
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      fetchProducts();
    }
  }, [templateId]);

  if (!selectedTemplate) {
    return (
      <div className="error-page">
        <h1>Error: Template Not Found</h1>
        <button onClick={() => navigate("/Offers-Page")}>Back to Offers</button>
      </div>
    );
  }

  const handleSearch = (query, type) => {
    if (type === "required") {
      setRequiredSearchQuery(query);
    } else if (type === "free") {
      setFreeSearchQuery(query);
    }
  };

  const addItem = (itemId, type) => {
    if (type === "required") {
      setSelectedRequiredItems((prevItems) => {
        const itemIndex = prevItems.findIndex((item) => item.id === itemId);
        if (itemIndex !== -1) {
          // Item already exists, increment the quantity
          const updatedItems = [...prevItems];
          updatedItems[itemIndex].quantity += 1;
          return updatedItems;
        }
        // Item doesn't exist, add new item with quantity 1
        return [...prevItems, { id: itemId, quantity: 1 }];
      });
    } else if (type === "free") {
      setSelectedFreeItems((prevItems) => {
        const itemIndex = prevItems.findIndex((item) => item.id === itemId);
        if (itemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[itemIndex].quantity += 1;
          return updatedItems;
        }
        return [...prevItems, { id: itemId, quantity: 1 }];
      });
    }

    // Clear search after adding
    if (type === "required") {
      setRequiredSearchQuery("");
    } else if (type === "free") {
      setFreeSearchQuery("");
    }
  };

  const updateQuantity = (itemId, type, action) => {
    if (action === "increase") {
      if (type === "required") {
        setSelectedRequiredItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else if (type === "free") {
        setSelectedFreeItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      }
    } else if (action === "decrease") {
      if (type === "required") {
        setSelectedRequiredItems(
          (prevItems) =>
            prevItems
              .map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
              .filter((item) => item.quantity > 0) // Remove item if quantity is 0
        );
      } else if (type === "free") {
        setSelectedFreeItems(
          (prevItems) =>
            prevItems
              .map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
              .filter((item) => item.quantity > 0) // Remove item if quantity is 0
        );
      }
    }
  };

  const handleSaveOffer = async () => {
    // Extract just the item IDs for required and free items
    const offerItems = [
      // For required items, include both ID and Quantity as a string
      ...selectedRequiredItems.map((item) => {
        const itemId = item.id || item; // Get the ID (ensure it's available)
        const quantity = item.quantity || 1; // Get the quantity (default to 1 if not available)
        return `${itemId}:${quantity}`; // Combine ID and Quantity into a string
      }),

      // For free items, include both ID and Quantity as a string
      ...selectedFreeItems.map((item) => {
        const itemId = item.id || item; // Get the ID (ensure it's available)
        const quantity = item.quantity || 1; // Get the quantity (default to 1 if not available)
        return `${itemId}:${quantity}`; // Combine ID and Quantity into a string
      }),
    ];

    // Construct the offerData object with the corrected structure
    const offerData = {
      name: selectedTemplate.name,
      type: selectedTemplate.id,
      startDate: offerStart || null,
      endDate: offerEnd || null,
      discountRate: parseInt(offerConfig.discountRate) || null,
      minSpend: parseFloat(offerConfig.minimumSpend) || null,
      freeDelivery: templateId === "spend_x_get_free_delivery" ? true : false,
      offerItems: offerItems, // Now offerItems is an array of IDs (strings)
    };

    // Log the offer data for debugging
    console.log("Offer Data:", offerData);

    try {
      // Call the API to save the offer
      const result = await CreateOffers(offerData);
      console.log("Offer saved successfully:", result);
      // Redirect to the Offers Page after saving
      navigate("/Offers-Page");
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("Failed to save offer:", error);
      alert("An error occurred while saving the offer. Please try again.");
    }
  };

  const filteredRequiredItems = availableItems.filter(
    (item) =>
      item?.name?.toLowerCase().includes(requiredSearchQuery.toLowerCase()) ||
      false
  );

  const filteredFreeItems = availableItems.filter(
    (item) =>
      item?.name?.toLowerCase().includes(freeSearchQuery.toLowerCase()) || false
  );

  const renderBuyGetFreeUI = () => (
    <div className="offer-layout">
      {/* Left Section: What User Buys */}
      <div className="offer-left">
        <h3>What the User Buys</h3>
        <input
          type="text"
          placeholder="Search items..."
          value={requiredSearchQuery}
          onChange={(e) => handleSearch(e.target.value, "required")}
        />
        <div className="search-results-container">
          <ul className="search-results">
            {filteredRequiredItems.map((item) => (
              <li key={item.id} onClick={() => addItem(item.id, "required")}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <h4>Selected Items:</h4>
        <ul className="selected-items">
          {selectedRequiredItems.map((item) => {
            const itemDetails = availableItems.find((i) => i.id === item.id);
            return (
              <li key={item.id}>
                {itemDetails.name}
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, "required", "decrease")
                    }
                    disabled={item.quantity <= 0} // Disable button if quantity is 0
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, "required", "increase")
                    }
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Section: What User Gets */}
      <div className="offer-right">
        <h3>What the User Gets</h3>
        <input
          type="text"
          placeholder="Search items..."
          value={freeSearchQuery}
          onChange={(e) => handleSearch(e.target.value, "free")}
        />
        <div className="search-results-container">
          <ul className="search-results">
            {filteredFreeItems.map((item) => (
              <li key={item.id} onClick={() => addItem(item.id, "free")}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <h4>Selected Items:</h4>
        <ul className="selected-items">
          {selectedFreeItems.map((item) => {
            const itemDetails = availableItems.find((i) => i.id === item.id);
            return (
              <li key={item.id}>
                {itemDetails.name}
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, "free", "decrease")}
                    disabled={item.quantity <= 0} // Disable button if quantity is 0
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, "free", "increase")}
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  const renderDiscountUI = () => (
    <div className="offer-layout">
      <div className="offer-discount">
        <label htmlFor="discountRate">Discount Percentage (%):</label>
        <input
          type="number"
          id="discountRate"
          value={offerConfig.discountRate || ""}
          onChange={(e) =>
            setOfferConfig({ ...offerConfig, discountRate: e.target.value })
          }
          placeholder="Enter discount %"
        />
      </div>
    </div>
  );

  const renderFreeDeliveryUI = () => (
    <div className="offer-layout">
      <div className="offer-discount">
        <div className="input-group">
          <label htmlFor="minimumSpend">Minimum Spend for Free Delivery:</label>
          <input
            type="number"
            id="minimumSpend"
            value={offerConfig.minimumSpend || ""}
            onChange={(e) =>
              setOfferConfig({ ...offerConfig, minimumSpend: e.target.value })
            }
            placeholder="minimum spend for free delivery"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="offer-creation-page">
      {/* Header with Save/Cancel Buttons */}
      <div className="page-header">
        <div className="description">
          <h1>{selectedTemplate.name}</h1>
          <p>{selectedTemplate.description}</p>
        </div>
        <div className="buttons">
          <button
            type="button"
            className="save-button"
            onClick={handleSaveOffer}
          >
            Save Offer
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/Offers-Page")}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Render UI Based on Template Type */}
      {templateId === "percent_off" && renderDiscountUI()}
      {templateId === "buy_x_get_y_free" && renderBuyGetFreeUI()}
      {templateId === "spend_x_get_free_delivery" && renderFreeDeliveryUI()}

      {/* Active Period Section */}
      <div className="offer-active-period">
        <h3>Set Offer Active Period</h3>
        <div className="active-period-inputs">
          <div>
            <label>Start Date and Time:</label>
            <input
              type="datetime-local"
              value={offerStart}
              onChange={(e) => setOfferStart(e.target.value)}
            />
          </div>
          <div>
            <label>End Date and Time:</label>
            <input
              type="datetime-local"
              value={offerEnd}
              onChange={(e) => setOfferEnd(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCreationPage;
