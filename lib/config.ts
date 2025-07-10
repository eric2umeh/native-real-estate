// lib/config.ts
export const AppwriteConfig = {
  platform: "com.eric.realestate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "YOUR_ENDPOINT",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "YOUR_PROJECT_ID",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "YOUR_DB_ID",
  galleriesCollectionId: 
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID || "galleries",
  reviewsCollectionId: 
    process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || "reviews",
  agentsCollectionId: 
    process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID || "agents",
  propertiesCollectionId: 
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID || "properties",
  bucketId: 
    process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID || "bucket",
};