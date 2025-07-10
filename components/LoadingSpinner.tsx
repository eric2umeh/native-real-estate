"use client"
import { View, ActivityIndicator, Text } from "react-native"

interface LoadingSpinnerProps {
  size?: "small" | "large"
  color?: string
  text?: string
}

const LoadingSpinner = ({ size = "large", color = "#0061FF", text }: LoadingSpinnerProps) => {
  return (
    <View className="flex-1 justify-center items-center py-8">
      <ActivityIndicator size={size} color={color} />
      {text && <Text className="text-sm font-rubik text-black-200 mt-2">{text}</Text>}
    </View>
  )
}

export default LoadingSpinner
