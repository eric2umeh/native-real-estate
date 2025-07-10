import { ID, Databases, Client } from "react-native-appwrite"
import { AppwriteConfig, validateConfig } from "./config"
import { agentImages, galleryImages, propertiesImages, reviewImages } from "./data"

// Create a separate client instance for seeding to avoid conflicts
const createSeedClient = () => {
  const seedClient = new Client()
  seedClient
    .setEndpoint(AppwriteConfig.endpoint)
    .setProject(AppwriteConfig.projectId)
    .setPlatform(AppwriteConfig.platform)

  return new Databases(seedClient)
}

const propertyTypes = ["House", "Townhouse", "Condo", "Duplex", "Studio", "Villa", "Apartment", "Other"]

const facilities = ["Laundry", "Parking", "Gym", "Wifi", "Pet-friendly"]

function getRandomSubset<T>(array: T[], minItems: number, maxItems: number): T[] {
  const subsetSize = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems
  return [...array].sort(() => 0.5 - Math.random()).slice(0, subsetSize)
}

async function clearCollection(databases: Databases, collectionId: string) {
  try {
    console.log(`Clearing collection: ${collectionId}`)
    const documents = await databases.listDocuments(AppwriteConfig.databaseId, collectionId)
    console.log(`Found ${documents.documents.length} documents to delete`)

    for (const doc of documents.documents) {
      await databases.deleteDocument(AppwriteConfig.databaseId, collectionId, doc.$id)
    }
    console.log(`Cleared collection: ${collectionId}`)
  } catch (error) {
    console.error(`Error clearing collection ${collectionId}:`, error)
    // Don't throw error, just log it and continue
  }
}

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Validate configuration first
    if (!validateConfig()) {
      throw new Error("Invalid Appwrite configuration. Please check your environment variables.")
    }

    // Create a fresh database instance for seeding
    const databases = createSeedClient()

    // Test connection first by trying to list documents from agents collection
    try {
      await databases.listDocuments(AppwriteConfig.databaseId, AppwriteConfig.agentsCollectionId, [])
      console.log("Database connection successful")
    } catch (error) {
      console.error("Database connection failed:", error)
      throw new Error("Cannot connect to Appwrite database. Please check your configuration and collection IDs.")
    }

    console.log("Clearing existing data...")

    // Clear existing data with better error handling
    const collections = [
      { id: AppwriteConfig.agentsCollectionId, name: "agents" },
      { id: AppwriteConfig.reviewsCollectionId, name: "reviews" },
      { id: AppwriteConfig.galleriesCollectionId, name: "galleries" },
      { id: AppwriteConfig.propertiesCollectionId, name: "properties" },
    ]

    for (const collection of collections) {
      await clearCollection(databases, collection.id)
    }

    console.log("Cleared all existing data.")

    // Seed Agents
    console.log("Seeding agents...")
    const agents = []
    for (let i = 1; i <= 5; i++) {
      try {
        const agent = await databases.createDocument(
          AppwriteConfig.databaseId,
          AppwriteConfig.agentsCollectionId,
          ID.unique(),
          {
            name: `Agent ${i}`,
            email: `agent${i}@example.com`,
            avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
          },
        )
        agents.push(agent)
      } catch (error) {
        console.error(`Failed to create agent ${i}:`, error)
      }
    }
    console.log(`Seeded ${agents.length} agents.`)

    // Seed Reviews
    console.log("Seeding reviews...")
    const reviews = []
    for (let i = 1; i <= 20; i++) {
      try {
        const review = await databases.createDocument(
          AppwriteConfig.databaseId,
          AppwriteConfig.reviewsCollectionId,
          ID.unique(),
          {
            name: `Reviewer ${i}`,
            avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
            review: `This is a great property! I really enjoyed my stay here. The location is perfect and the amenities are top-notch. Review ${i}.`,
            rating: Math.floor(Math.random() * 5) + 1,
          },
        )
        reviews.push(review)
      } catch (error) {
        console.error(`Failed to create review ${i}:`, error)
      }
    }
    console.log(`Seeded ${reviews.length} reviews.`)

    // Seed Galleries
    console.log("Seeding galleries...")
    const galleries = []
    for (let i = 0; i < galleryImages.length; i++) {
      try {
        const gallery = await databases.createDocument(
          AppwriteConfig.databaseId,
          AppwriteConfig.galleriesCollectionId,
          ID.unique(),
          {
            image: galleryImages[i],
          },
        )
        galleries.push(gallery)
      } catch (error) {
        console.error(`Failed to create gallery ${i}:`, error)
      }
    }
    console.log(`Seeded ${galleries.length} galleries.`)

    // Seed Properties
    console.log("Seeding properties...")
    const propertyNames = [
      "Modern Downtown Loft",
      "Cozy Family Home",
      "Luxury Beachfront Villa",
      "Urban Studio Apartment",
      "Spacious Suburban House",
      "Charming Townhouse",
      "Executive Penthouse",
      "Garden View Condo",
      "Historic Brownstone",
      "Contemporary Duplex",
      "Waterfront Apartment",
      "Mountain View Cabin",
      "City Center Studio",
      "Elegant Manor House",
      "Seaside Cottage",
      "Metropolitan Loft",
      "Peaceful Retreat",
      "Designer Home",
      "Luxury High-Rise",
      "Quaint Bungalow",
    ]

    const addresses = [
      "123 Main Street, Downtown",
      "456 Oak Avenue, Suburbs",
      "789 Beach Road, Waterfront",
      "321 Park Lane, City Center",
      "654 Hill Drive, Heights",
      "987 Garden Way, Greenville",
      "147 River Street, Riverside",
      "258 Forest Avenue, Woodland",
      "369 Lake View Drive, Lakeside",
      "741 Mountain Road, Hillcrest",
      "852 Sunset Boulevard, West End",
      "963 Harbor Street, Marina",
      "159 Valley Road, Meadowbrook",
      "357 Pine Street, Pinehurst",
      "468 Maple Avenue, Maplewood",
      "579 Cedar Lane, Cedarville",
      "681 Elm Street, Elmwood",
      "792 Birch Road, Birchwood",
      "813 Willow Way, Willowbrook",
      "924 Cherry Lane, Cherrywood",
    ]

    let propertiesCreated = 0
    for (let i = 1; i <= 20; i++) {
      try {
        const assignedAgent = agents.length > 0 ? agents[Math.floor(Math.random() * agents.length)] : null
        const assignedReviews = reviews.length > 0 ? getRandomSubset(reviews, 1, Math.min(5, reviews.length)) : []
        const assignedGalleries =
          galleries.length > 0 ? getRandomSubset(galleries, 1, Math.min(5, galleries.length)) : []
        const selectedFacilities = getRandomSubset(facilities, 1, facilities.length)

        const image = propertiesImages[i % propertiesImages.length]

        await databases.createDocument(AppwriteConfig.databaseId, AppwriteConfig.propertiesCollectionId, ID.unique(), {
          name: propertyNames[i - 1] || `Property ${i}`,
          type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
          description: `Beautiful ${propertyNames[i - 1] || `Property ${i}`} located in a prime location. This property offers modern amenities, spacious rooms, and excellent connectivity to major attractions. Perfect for families and professionals alike.`,
          address: addresses[i - 1] || `${123 + i} Property Street, City ${i}`,
          geolocation: `${40.7128 + Math.random() * 0.1}, ${-74.006 + Math.random() * 0.1}`,
          price: Math.floor(Math.random() * 4000) + 1000,
          area: Math.floor(Math.random() * 2000) + 500,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          rating: Math.floor(Math.random() * 2) + 4, // Rating between 4-5
          facilities: selectedFacilities,
          image: image,
          agent: assignedAgent?.$id || null,
          reviews: assignedReviews.map((review) => review.$id),
          gallery: assignedGalleries.map((gallery) => gallery.$id),
        })
        propertiesCreated++
      } catch (error) {
        console.error(`Failed to create property ${i}:`, error)
      }
    }

    console.log(`Seeded ${propertiesCreated} properties.`)
    console.log("Data seeding completed successfully!")
    return true
  } catch (error) {
    console.error("Error seeding data:", error)
    return false
  }
}
