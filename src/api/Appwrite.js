import { Client, Account, ID, Databases, Storage, Query } from "appwrite";
import AppwriteConfig from "../constants/AppwriteConfig";

const client = new Client();

client
  .setEndpoint(AppwriteConfig.endPoint)
  .setProject(AppwriteConfig.projectID);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// Auth
export const Login = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Error in Login:", error);
    throw new Error(error.message || "Unknown error occurred");
  }
};

// Database
export const loadCategories = async () => {
  try {
    const data = await databases.listDocuments(
      AppwriteConfig.databaseID,
      AppwriteConfig.categoryCollectionID
    );

    const categoriesData = data.documents.map((doc) => ({
      name: doc.Name,
      image: doc.image_url,
      category_id: doc.category_id,
      id: doc.$id,
    }));

    return categoriesData;
  } catch (error) {
    console.error("Error in loading categories:", error);
    throw new Error(error.message || "Unknown error occurred");
  }
};

export const createCategory = async ({ name, image, bucketID }) => {
  try {
    let imageUrl = null;

    if (image) {
      // Upload the image and get the URL
      imageUrl = await uploadImage(bucketID, image);
    }

    const data = {
      Name: name,
      category_id: name, // Using category name as the category_id
      image_url: imageUrl,
    };

    const cat = await databases.createDocument(
      AppwriteConfig.databaseID,
      AppwriteConfig.categoryCollectionID,
      ID.unique(),
      data
    );

    return cat;
  } catch (error) {
    console.log("🚀 ~ createCategory ~ error:", error);
    throw new Error(error.message || "Unknown error occurred");
  }
};

export const createProduct = async ({
  name,
  price,
  description,
  volume,
  image,
  categories,
}) => {
  try {
    let imageUrl = null;

    if (image) {
      // Upload the image and get the URL
      imageUrl = await uploadImage(
        AppwriteConfig.storage_product_images,
        image
      );
    }

    const data = {
      name,
      price,
      description,
      volume,
      image_uri: imageUrl,
      categories,
    };

    const result = await databases.createDocument(
      AppwriteConfig.databaseID,
      AppwriteConfig.itemsCollectionID,
      ID.unique(),
      data
    );

    return result;
  } catch (error) {
    console.log("🚀 ~ createProduct ~ error:", error);
    throw new Error("Error Creating Product");
  }
};

// Separate function to handle image upload
const uploadImage = async (bucketID, image) => {
  try {
    const uploadedImage = await storage.createFile(
      bucketID,
      ID.unique(),
      image
    );
    const imageUrl = storage.getFileView(bucketID, uploadedImage.$id);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
};

export const loadProducts = async () => {
  try {
    // Fetch documents from the database
    const result = await databases.listDocuments(
      AppwriteConfig.databaseID,
      AppwriteConfig.itemsCollectionID
    );

    // Ensure you are extracting the `id` and `name` correctly from the response.
    const products = result.documents.map((doc) => ({
      id: doc.$id, // Make sure the ID field is correctly accessed
      name: doc.name, // Assuming the document has a `name` field
    }));

    return products; // Return the list of products with correct id and name
  } catch (error) {
    console.error("🚀 ~ loadProducts ~ error:", error);
    throw new Error(error.message || "Unknown error occurred");
  }
};

export const loadProductsByCategory = async (categoryID) => {
  if (!categoryID) {
    throw new Error("Invalid category ID");
  }
  try {
    // Fetch documents from category collection based on category_id
    const data = await databases.listDocuments(
      AppwriteConfig.databaseID,
      AppwriteConfig.categoryCollectionID,
      [Query.equal("category_id", categoryID)]
    );

    // Ensure data.documents is defined and an array
    if (!data.documents || !Array.isArray(data.documents)) {
      throw new Error("No documents found for the given category ID");
    }

    // Extract product details from the items array in each document
    const products = data.documents.flatMap((doc) => {
      if (!doc.items || !Array.isArray(doc.items)) {
        throw new Error(
          "Document is missing the items field or it's not an array"
        );
      }
      return doc.items.map((item) => ({
        product_id: item.$id,
        name: item.name,
        image_uri: item.image_uri,
        price: item.price,
        volume: item.volume,
        description: item.description,
      }));
    });

    return products;
  } catch (error) {
    console.error("Error in loading products by category:", error);
    throw new Error(error.message || "Unknown error occurred");
  }
};

export const newOrdersCheck = async () => {
  try {
    // Fetch the current newOrders document
    const newOrderDocument = await databases.getDocument(
      AppwriteConfig.databaseID,
      AppwriteConfig.newOrderCollectionID,
      AppwriteConfig.newOrderDocID // Ensure this is the correct document ID for newOrders
    );

    console.log("Fetched newOrders document:", newOrderDocument);

    // Check if newOrders is greater than 0
    if (newOrderDocument.newOrders > 0) {
      console.log(`New orders detected: ${newOrderDocument.newOrders}`);

      // Call a function to process new orders, passing the array of order IDs
      processNewOrders(newOrderDocument.orderIds);
    }
  } catch (error) {
    console.error("Error fetching new orders document:", error);
  }
};

// Function to process new orders
const processNewOrders = async () => {
  try {
    // Step 1: Fetch new order IDs
    const newOrdersDoc = await databases.getDocument(
      AppwriteConfig.databaseID,
      AppwriteConfig.newOrderCollectionID,
      AppwriteConfig.newOrderDocID
    );

    const orderIds = newOrdersDoc.orderIds || [];
    if (orderIds.length === 0) {
      console.log("No new orders to process.");
      return;
    }

    console.log("Processing orders:", orderIds);

    for (let orderId of orderIds) {
      // Step 2: Fetch each order by its ID
      const order = await databases.getDocument(
        AppwriteConfig.databaseID,
        AppwriteConfig.orderCollectionID,
        orderId
      );

      // Example processing logic
      console.log("Processing order:", order);

      // Step 3: Update the order status or perform other tasks
      await databases.updateDocument(
        AppwriteConfig.databaseID,
        AppwriteConfig.orderCollectionID,
        orderId,
        { status: "preparing" }
      );
    }

    // Step 4: Reset the newOrders count and clear the orderIds array after processing
    await databases.updateDocument(
      AppwriteConfig.databaseID,
      AppwriteConfig.newOrderCollectionID,
      AppwriteConfig.newOrderDocID,
      {
        newOrders: 0,
        orderIds: [], // Clear the order IDs array
      }
    );

    console.log("New orders processed successfully and newOrders reset.");
  } catch (error) {
    console.error("Error processing orders:", error);
  }
};

// Call the check function every 2 minutes (120000 milliseconds)
setInterval(newOrdersCheck, 120000);

export const loadLiveOrders = async () => {
  try {
    const result = await databases.listDocuments(
      AppwriteConfig.databaseID,
      AppwriteConfig.orderCollectionID
    );

    return result;
  } catch (error) {
    console.log("🚀 ~ loadOrders ~ error:", error);
  }
};

export const updateOrderStatus = async (docId, newStatus) => {
  try {
    const result = await databases.updateDocument(
      AppwriteConfig.databaseID,
      AppwriteConfig.orderCollectionID,
      docId,
      { status: newStatus } // Use newStatus dynamically
    );
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

// Offers
export const CreateOffers = async (offerInfo) => {
  try {
    const result = await databases.createDocument(
      AppwriteConfig.databaseID,
      AppwriteConfig.OffersCollectionID,
      ID.unique(),
      offerInfo
    );
    console.log("Offer created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating offer:", error);
    throw error;
  }
};
