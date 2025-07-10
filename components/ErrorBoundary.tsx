import React from "react"
import { View, Text, TouchableOpacity } from "react-native"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 justify-center items-center bg-white px-5">
          <Text className="text-xl font-rubik-bold text-black-300 mb-4">Something went wrong</Text>
          <Text className="text-base font-rubik text-black-200 text-center mb-6">
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: undefined })}
            className="bg-primary-300 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-rubik-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
