import RestaurantBigcard from "@/src/components/shops/restaurantShop/RestaurantBigcard";
import Header from "@/src/components/ui/Header";
import ShopCard from "@/src/components/ui/ShopCard";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const FAVORITE_CATEGORIES = [
  {
    title: "Grocery & Essentials",
    icon: require("@/src/assets/images/shopCategeory/groceryActive.png"),
  },
  {
    title: "Food & Restaurant",
    icon: require("@/src/assets/images/shopCategeory/restaurant.png"),
  },
];

const MOCK_GROCERY_SHOPS = [
  {
    name: "Balaji Mart",
    rating: 4.5,
    reviews: 120,
    distance: "1.2 km",
    deliveryTime: "25 min",
    tags: ["Grocery", "Essentials"],
    imageSource: require("@/src/assets/images/balajimart.png"),
    isSaved: true,
  },
  {
    name: "Fresh Market",
    rating: 4.2,
    reviews: 85,
    distance: "2.0 km",
    deliveryTime: "30 min",
    tags: ["Vegetables", "Fruits"],
    imageSource: {
      uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop",
    },
    isSaved: true,
  },
];

const MOCK_RESTAURANTS = [
  {
    name: "Spicy Treats",
    deliveryTime: "35 mins",
    rating: 4.8,
    type: "Indian",
    distance: "3.5 km",
    isSaved: true,
    data: [
      {
        itemName: "Paneer Tikka",
        price: 250,
        isVeg: true,
        imageUrl:
          "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=60",
      },
      {
        itemName: "Chicken Curry",
        price: 350,
        isVeg: false,
        imageUrl:
          "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    name: "The Pizza Place",
    deliveryTime: "40 mins",
    rating: 4.6,
    type: "Italian",
    distance: "4.2 km",
    isSaved: true,
    data: [
      {
        itemName: "Margherita Pizza",
        price: 299,
        isVeg: true,
        imageUrl:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60",
      },
    ],
  },
];

const MyFavorites = () => {
  const [activeCategory, setActiveCategory] = useState(
    FAVORITE_CATEGORIES[0].title,
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="My Favorites" back border />

      {/* Category Chips */}
      <View className="flex-row mx-4 mt-4 mb-3 gap-3 justify-start">
        {FAVORITE_CATEGORIES.map((category, index) => {
          const isActive = activeCategory === category.title;
          const displayName =
            category.title === "Food & Restaurant" ? "Restaurant" : "Grocery";

          return (
            <Pressable
              key={index}
              onPress={() => setActiveCategory(category.title)}
              className={`px-5 py-1.5 rounded-full border ${
                isActive
                  ? "bg-gray-900 border-gray-900 shadow-sm shadow-gray-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-[14px] font-semibold tracking-wide ${
                  isActive ? "text-white" : "text-gray-600"
                }`}
              >
                {displayName}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-10 mt-2">
          {activeCategory === "Grocery & Essentials"
            ? MOCK_GROCERY_SHOPS.map((shop, index) => (
                <View key={index}>
                  <ShopCard
                    name={shop.name}
                    rating={shop.rating}
                    reviews={shop.reviews}
                    distance={shop.distance}
                    deliveryTime={shop.deliveryTime}
                    tags={shop.tags}
                    imageSource={shop.imageSource}
                    isSaved={shop.isSaved}
                    onPress={() => {}}
                    onSavePress={() => {}}
                  />
                  {index < MOCK_GROCERY_SHOPS.length - 1 && (
                    <View className="border-t border-gray-100" />
                  )}
                </View>
              ))
            : MOCK_RESTAURANTS.map((restaurant, index) => (
                <View key={index} className="items-center w-full mb-3.5">
                  <RestaurantBigcard
                    name={restaurant.name}
                    deliveryTime={restaurant.deliveryTime}
                    rating={restaurant.rating}
                    type={restaurant.type}
                    distance={restaurant.distance}
                    isSaved={restaurant.isSaved}
                    data={restaurant.data}
                    onPress={() => {}}
                    onSavePress={() => {}}
                  />
                  {index < MOCK_RESTAURANTS.length - 1 && (
                    <View className="h-[1px] w-full bg-gray-100 mt-0" />
                  )}
                </View>
              ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyFavorites;
