import { Client, Databases, Query, ID, Storage } from "appwrite";

const appwrite = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6609793cbc1ef95169d2");

const databases = new Databases(appwrite);
const storage = new Storage(appwrite);

export const loadCategories = async () => {
  try {
    const data = await databases.listDocuments(
      "660bd50069d33a8c5123",
      "categories"
    );

    const categoriesData = data.documents.map((doc) => ({
      title: doc.Name,
      image: doc.image_url,
      category_id: doc.category_id,
    }));

    return categoriesData;
  } catch (error) {
    console.error("Error in loading categories:", error);
    throw new Error(error.message || "Unknown error occurred");
  }
};

export const createCategory = async (name, imageFile) => {
  try {
    let imageUrl = "";
    if (imageFile) {
      const fileResponse = await storage.createFile(
        "660bf05c7429e06a9bd0",
        ID.unique(),
        imageFile
      );
      imageUrl = storage.getFileView("660bf05c7429e06a9bd0", fileResponse.$id);
    }

    const result = await databases.createDocument(
      "660bd50069d33a8c5123",
      "categories",
      ID.unique(),
      {
        Name: name,
        category_id: name,
        image_url: imageUrl,
      }
    );

    return result;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const loadCategoryProducts = async (categoryID) => {
  if (!categoryID) {
    throw new Error("Invalid category ID");
  }
  try {
    // Fetch documents from category collection based on category_id
    const data = await databases.listDocuments(
      "660bd50069d33a8c5123", // Replace with your database ID
      "categories", // Replace with your category collection ID
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
    console.log("🚀 ~ loadCategoryProducts ~ error:", error);
    throw new Error(error.message || "Unknown error occurred");
  }
};
