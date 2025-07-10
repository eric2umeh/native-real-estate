import { ID, Databases } from "react-native-appwrite";
import { AppwriteConfig, client } from "./config";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "./data";

const databases = new Databases(client);

const propertyTypes = [
  "House", "Townhouse", "Condo", "Duplex", 
  "Studio", "Villa", "Apartment", "Other"
];

const facilities = [
  "Laundry", "Parking", "Gym", "Wifi", "Pet-friendly"
];

function getRandomSubset<T>(array: T[], minItems: number, maxItems: number): T[] {
  const subsetSize = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;
  return [...array].sort(() => 0.5 - Math.random()).slice(0, subsetSize);
}

async function clearCollection(collectionId: string) {
  const documents = await databases.listDocuments(
    AppwriteConfig.databaseId,
    collectionId
  );
  for (const doc of documents.documents) {
    await databases.deleteDocument(
      AppwriteConfig.databaseId,
      collectionId,
      doc.$id
    );
  }
}

export async function seedDatabase() {
  try {
    // Clear existing data
    await Promise.all([
      clearCollection(AppwriteConfig.agentsCollectionId),
      clearCollection(AppwriteConfig.reviewsCollectionId),
      clearCollection(AppwriteConfig.galleriesCollectionId),
      clearCollection(AppwriteConfig.propertiesCollectionId),
    ]);

    console.log("Cleared all existing data.");

    // Seed Agents
    const agents = [];
    for (let i = 1; i <= 5; i++) {
      const agent = await databases.createDocument(
        AppwriteConfig.databaseId,
        AppwriteConfig.agentsCollectionId,
        ID.unique(),
        {
          name: `Agent ${i}`,
          email: `agent${i}@example.com`,
          avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
        }
      );
      agents.push(agent);
    }
    console.log(`Seeded ${agents.length} agents.`);

    // Seed Reviews
    const reviews = [];
    for (let i = 1; i <= 20; i++) {
      const review = await databases.createDocument(
        AppwriteConfig.databaseId,
        AppwriteConfig.reviewsCollectionId,
        ID.unique(),
        {
          name: `Reviewer ${i}`,
          avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
          review: `This is a review by Reviewer ${i}.`,
          rating: Math.floor(Math.random() * 5) + 1,
        }
      );
      reviews.push(review);
    }
    console.log(`Seeded ${reviews.length} reviews.`);

    // Seed Galleries
    const galleries = [];
    for (const image of galleryImages) {
      const gallery = await databases.createDocument(
        AppwriteConfig.databaseId,
        AppwriteConfig.galleriesCollectionId,
        ID.unique(),
        { image }
      );
      galleries.push(gallery);
    }
    console.log(`Seeded ${galleries.length} galleries.`);

    // Seed Properties
    for (let i = 1; i <= 20; i++) {
      const assignedAgent = agents[Math.floor(Math.random() * agents.length)];
      const assignedReviews = getRandomSubset(reviews, 5, 7);
      const assignedGalleries = getRandomSubset(galleries, 3, 8);
      const selectedFacilities = getRandomSubset(facilities, 1, facilities.length);

      const image = propertiesImages[i % propertiesImages.length];

      await databases.createDocument(
        AppwriteConfig.databaseId,
        AppwriteConfig.propertiesCollectionId,
        ID.unique(),
        {
          name: `Property ${i}`,
          type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
          description: `This is the description for Property ${i}.`,
          address: `123 Property Street, City ${i}`,
          geolocation: `192.168.1.${i}, 192.168.1.${i}`,
          price: Math.floor(Math.random() * 9000) + 1000,
          area: Math.floor(Math.random() * 3000) + 500,
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 5) + 1,
          rating: Math.floor(Math.random() * 5) + 1,
          facilities: selectedFacilities,
          image: image,
          agent: assignedAgent.$id,
          reviews: assignedReviews.map((review) => review.$id),
          gallery: assignedGalleries.map((gallery) => gallery.$id),
        }
      );
    }

    console.log("Data seeding completed.");
    return true;
  } catch (error) {
    console.error("Error seeding data:", error);
    return false;
  }
}