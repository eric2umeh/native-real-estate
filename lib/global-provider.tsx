"use client"

import { createContext, useContext, type ReactNode, useState, useEffect, useRef } from "react"
import { getCurrentUser } from "./appwrite"

interface GlobalContextType {
  isLogged: boolean
  user: User | null
  loading: boolean
  refetch: () => Promise<void>
}

interface User {
  $id: string
  name: string
  email: string
  avatar: string
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const fetchingRef = useRef(false)

  const fetchUser = async () => {
    // Prevent multiple simultaneous calls
    if (fetchingRef.current) return

    try {
      fetchingRef.current = true
      setLoading(true)

      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Error fetching user:", error)
      setUser(null)
    } finally {
      setLoading(false)
      setIsInitialized(true)
      fetchingRef.current = false
    }
  }

  useEffect(() => {
    // Only fetch user once when component mounts
    if (!isInitialized) {
      fetchUser()
    }
  }, [isInitialized])

  const contextValue: GlobalContextType = {
    isLogged: !!user,
    user,
    loading,
    refetch: fetchUser,
  }

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalProvider")
  }
  return context
}
