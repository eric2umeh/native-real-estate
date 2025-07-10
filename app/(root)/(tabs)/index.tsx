// app/(root)/(tabs)/index.tsx
import { useState, useEffect } from "react";
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { Card, FeaturedCard } from "@/components/Cards";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";

const Home = () => {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams();
  
  const [filter, setFilter] = useState(params.filter || "All");
  const [query, setQuery] = useState(params.query || "");

  const { 
    data: latestProperties, 
    loading: loadingLatest 
  } = useAppwrite(getLatestProperties);

  const {
    data: properties,
    loading: loadingProperties,
    refetch
  } = useAppwrite(getProperties, { filter, query, limit: 6 });

  useEffect(() => {
    if (params.filter !== filter || params.query !== query) {
      setFilter(params.filter || "All");
      setQuery(params.query || "");
      refetch();
    }
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={properties || []}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        ListEmptyComponent={
          loadingProperties ? (
            <ActivityIndicator size="large" className="my-8" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            {/* Header with user info */}
            <View className="flex-row justify-between items-center mt-5">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: user.avatar }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="ml-2">
                  <Text className="text-xs text-gray-500">Good Morning</Text>
                  <Text className="text-base font-medium">{user.name}</Text>
                </View>
              </View>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>

            <Search initialQuery={query} />

            {/* Featured Properties */}
            <View className="my-5">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold">Featured</Text>
                <TouchableOpacity>
                  <Text className="text-blue-500 font-bold">See all</Text>
                </TouchableOpacity>
              </View>

              {loadingLatest ? (
                <ActivityIndicator size="large" className="my-4" />
              ) : (
                <FlatList
                  horizontal
                  data={latestProperties || []}
                  renderItem={({ item }) => (
                    <FeaturedCard 
                      item={item} 
                      onPress={() => handleCardPress(item.$id)} 
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-5 mt-5"
                />
              )}
            </View>

            {/* Recommendations */}
            <View className="mt-5">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold">Our Recommendation</Text>
                <TouchableOpacity>
                  <Text className="text-blue-500 font-bold">See all</Text>
                </TouchableOpacity>
              </View>
              <Filters currentFilter={filter} />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        contentContainerClassName="pb-32"
        columnWrapperClassName="gap-5 px-5"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Home;