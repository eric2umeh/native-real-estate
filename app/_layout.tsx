"use client"

import { useEffect, useState, useCallback } from "react"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { View, Text } from "react-native"
import * as Font from "expo-font"

import "./global.css"
import { GlobalProvider } from "@/lib/global-provider"
import ErrorBoundary from "@/components/ErrorBoundary"

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

const customFonts = {
  "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
  "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
  "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
  "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
  "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
  "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [fontError, setFontError] = useState<Error | null>(null)

  const loadResourcesAndDataAsync = useCallback(async () => {
    try {
      // Load fonts
      await Font.loadAsync(customFonts)
    } catch (e) {
      console.warn("Font loading error:", e)
      setFontError(e as Error)
    } finally {
      setAppIsReady(true)
    }
  }, [])

  useEffect(() => {
    loadResourcesAndDataAsync()
  }, [loadResourcesAndDataAsync])

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading fonts: {fontError.message}</Text>
      </View>
    )
  }

  return (
    <ErrorBoundary>
      <GlobalProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </GlobalProvider>
    </ErrorBoundary>
  )
}
