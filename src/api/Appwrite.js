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
