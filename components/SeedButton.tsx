"use client"

import { useState } from "react"
import { TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native"
import { seedDatabase } from "@/lib/seed"

const SeedButton = () => {
  const [isSeeding, setIsSeeding] = useState(false)

  const handleSeed = async () => {
    Alert.alert(
      "Seed Database",
      "This will clear existing data and add sample properties. Make sure your Appwrite configuration is correct. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Seed Data",
          onPress: async () => {
            try {
              setIsSeeding(true)
              console.log("Starting seeding process...")
              const success = await seedDatabase()

              if (success) {
                Alert.alert("Success", "Database seeded successfully! You should now see properties in the app.")
              } else {
                Alert.alert("Error", "Failed to seed database. Check console for details.")
              }
            } catch (error) {
              console.error("Seed error:", error)
              Alert.alert("Error", `Failed to seed database: ${error}`)
            } finally {
              setIsSeeding(false)
            }
          },
        },
      ],
    )
  }

  return (
    <TouchableOpacity
      onPress={handleSeed}
      disabled={isSeeding}
      className="bg-primary-300 px-4 py-2 rounded-full flex-row items-center"
    >
      {isSeeding && <ActivityIndicator size="small" color="white" className="mr-2" />}
      <Text className="text-white font-rubik-medium">{isSeeding ? "Seeding..." : "Seed Database"}</Text>
    </TouchableOpacity>
  )
}

export default SeedButton
