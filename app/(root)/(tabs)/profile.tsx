"use client"

import {
  Alert,
  Image,
  type ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native"

import { logout } from "@/lib/appwrite"
import { useGlobalContext } from "@/lib/global-provider"

import icons from "@/constants/icons"
import { settings } from "@/constants/data"
import { useState } from "react"
import SeedButton from "@/components/SeedButton"

interface SettingsItemProp {
  icon: ImageSourcePropType
  title: string
  onPress?: () => void
  textStyle?: string
  showArrow?: boolean
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow = true }: SettingsItemProp) => (
  <TouchableOpacity onPress={onPress} className="flex flex-row items-center justify-between py-3">
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
)

const Profile = () => {
  const { user, refetch, loading } = useGlobalContext()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const result = await logout()
      if (result) {
        Alert.alert("Success", "Logged out successfully")
        await refetch()
      } else {
        Alert.alert("Error", "Failed to logout")
      }
    } catch (error) {
      console.error("Logout error:", error)
      Alert.alert("Error", "An error occurred during logout")
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="h-full bg-white flex justify-center items-center">
        <ActivityIndicator size="large" color="#0061FF" />
      </SafeAreaView>
    )
  }

  if (!user) {
    return (
      <SafeAreaView className="h-full bg-white flex justify-center items-center">
        <Text className="text-lg font-rubik-medium text-black-300">No user data available</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 px-7">
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image source={{ uri: user?.avatar }} className="size-44 relative rounded-full" />
            <TouchableOpacity className="absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9" />
            </TouchableOpacity>

            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
            <Text className="text-sm font-rubik text-black-200 mt-1">{user?.email}</Text>
          </View>
        </View>

        <View className="flex items-center mt-5 mb-5">
          <SeedButton />
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="My Bookings" />
          <SettingsItem icon={icons.wallet} title="Payments" />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isLoggingOut}
            className="flex flex-row items-center justify-between py-3"
          >
            <View className="flex flex-row items-center gap-3">
              <Image source={icons.logout} className="size-6" />
              <Text className="text-lg font-rubik-medium text-danger">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Text>
            </View>
            {isLoggingOut && <ActivityIndicator size="small" color="#F75555" />}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
