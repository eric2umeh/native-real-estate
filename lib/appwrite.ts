import { Client, Account, Databases, OAuthProvider, Avatars, Query, Storage } from "react-native-appwrite"
import * as Linking from "expo-linking"
import { openAuthSessionAsync } from "expo-web-browser"
import { AppwriteConfig, validateConfig } from "./config"

// Validate configuration before initializing
if (!validateConfig()) {
  console.error("Appwrite configuration is invalid. Please check your environment variables.")
}

// Initialize client
export const client = new Client()

try {
  client.setEndpoint(AppwriteConfig.endpoint).setProject(AppwriteConfig.projectId).setPlatform(AppwriteConfig.platform)

  console.log("Appwrite client initialized successfully")
} catch (error) {
  console.error("Failed to initialize Appwrite client:", error)
}

// Initialize services
export const avatar = new Avatars(client)
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Test connection function
export const testConnection = async () => {
  try {
    // Test connection by trying to list documents from a collection
    await databases.listDocuments(AppwriteConfig.databaseId, AppwriteConfig.agentsCollectionId, [Query.limit(1)])
    console.log("Appwrite connection successful")
    return true
  } catch (error) {
    console.error("Appwrite connection failed:", error)
    return false
  }
}

// Auth functions
export async function login() {
  try {
    const redirectUri = Linking.createURL("/")
    const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri)
    if (!response) throw new Error("Create OAuth2 token failed")

    const browserResult = await openAuthSessionAsync(response.toString(), redirectUri)
    if (browserResult.type !== "success") throw new Error("Create OAuth2 token failed")

    const url = new URL(browserResult.url)
    const secret = url.searchParams.get("secret")?.toString()
    const userId = url.searchParams.get("userId")?.toString()
    if (!secret || !userId) throw new Error("Create OAuth2 token failed")

    const session = await account.createSession(userId, secret)
    if (!session) throw new Error("Failed to create session")

    return true
  } catch (error) {
    console.error("Login error:", error)
    return false
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current")
    return result
  } catch (error) {
    console.error("Logout error:", error)
    return false
  }
}

export async function getCurrentUser() {
  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 10000)
    })

    const result = (await Promise.race([account.get(), timeoutPromise])) as any

    if (result && result.$id) {
      const userAvatar = avatar.getInitials(result.name)
      return {
        ...result,
        avatar: userAvatar.toString(),
      }
    }
    return null
  } catch (error) {
    // Don't log error if user is simply not authenticated
    if (error instanceof Error && (error.message.includes("401") || error.message.includes("Unauthorized"))) {
      return null
    }
    console.log("Get current user error:", error)
    return null
  }
}

// Property functions
export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(AppwriteConfig.databaseId, AppwriteConfig.propertiesCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(5),
    ])
    return result.documents
  } catch (error) {
    console.error("Error getting latest properties:", error)
    return []
  }
}

export async function getProperties({
  filter = "All",
  query = "",
  limit = 6,
}: {
  filter?: string
  query?: string
  limit?: number
} = {}) {
  try {
    const queries = [Query.orderDesc("$createdAt"), Query.limit(limit)]

    if (filter && filter !== "All") {
      queries.push(Query.equal("type", filter))
    }

    if (query && query.trim()) {
      queries.push(
        Query.or([Query.search("name", query), Query.search("address", query), Query.search("description", query)]),
      )
    }

    const result = await databases.listDocuments(
      AppwriteConfig.databaseId,
      AppwriteConfig.propertiesCollectionId,
      queries,
    )

    return result.documents
  } catch (error) {
    console.error("Error getting properties:", error)
    return []
  }
}

export async function getPropertyById({ id }: { id: string }) {
  try {
    if (!id) {
      throw new Error("Property ID is required")
    }

    const result = await databases.getDocument(AppwriteConfig.databaseId, AppwriteConfig.propertiesCollectionId, id)
    return result
  } catch (error) {
    console.error("Error getting property by ID:", error)
    return null
  }
}
