import { Client, Databases, ID, Storage } from "appwrite";

const appwrite = new Client();

appwrite
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6609793cbc1ef95169d2");

const databases = new Databases(appwrite);
const storage = new Storage(appwrite);

export const database = {
  listDocuments: async (databaseId, collectionId) => {
    try {
      const result = await databases.listDocuments(databaseId, collectionId);

      return result;
    } catch (error) {
      console.error("Error listing documents:", error);
      throw error;
    }
  },

  createCategory: async (name, imageFile) => {
    try {
      let imageUrl = "";
      if (imageFile) {
        const fileResponse = await storage.createFile(
          "660bf05c7429e06a9bd0",
          "unique()",
          imageFile
        );

        imageUrl = storage.getFileView(
          "660bf05c7429e06a9bd0",
          fileResponse.$id
        );
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
      console.error("🚀 ~ createCategory:async ~ error:", error);
      throw error;
    }
  },
};

export default appwrite;
