// lib/config.ts
export const AppwriteConfig = {
  platform: "com.eric.realestate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "YOUR_PROJECT_ID",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "YOUR_DB_ID",
  galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID || "686b9efb001eab347148",
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || "686e356f001b084f94c2",
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID || "686b9b4a002d16a2d718",
  propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID || "686e362c0010afbc6311",
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID || "bucket",
}

// Validate configuration
export const validateConfig = () => {
  const requiredFields = ["endpoint", "projectId", "databaseId"]
  const missing = requiredFields.filter(
    (field) =>
      !AppwriteConfig[field as keyof typeof AppwriteConfig] ||
      AppwriteConfig[field as keyof typeof AppwriteConfig].startsWith("YOUR_"),
  )

  if (missing.length > 0) {
    console.error("Missing Appwrite configuration:", missing)
    return false
  }

  return true
}
