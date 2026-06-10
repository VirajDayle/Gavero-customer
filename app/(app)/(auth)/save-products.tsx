import ProductCard from "@/src/components/shops/groceryShop/ProductCard";
import FoodCard from "@/src/components/shops/restaurantShop/FoodCard";
import Header from "@/src/components/ui/Header";
import { Product } from "@/src/types/product";
import { FlashList } from "@shopify/flash-list";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
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

const MOCK_GROCERY_SHOPS_PRODUCTS = [
  {
    shopName: "Balaji Mart",
    products: [
      {
        id: 1,
        title: "Tata Tea Premium | Desh Ki Chai",
        price: 507,
        mrp: 600,
        image: {
          uri: "https://m.media-amazon.com/images/I/41wospnFmoL.AC_SX250.jpg",
        },
        inStock: true,
        unit: "1.5kg",
      },
      {
        id: 2,
        title: "NESCAFE Classic Instant Coffee",
        price: 320,
        mrp: 350,
        image: {
          uri: "https://m.media-amazon.com/images/I/41b6lQgmXlL._SY300_SX300_QL70_FMwebp_.jpg",
        },
        inStock: true,
        unit: "200g",
      },
      {
        id: 3,
        title: "Aashirvaad Select Premium Sharbati Atta",
        price: 250,
        mrp: 280,
        image: {
          uri: "https://m.media-amazon.com/images/I/61bU-411a7L._SY300_SX300_QL70_FMwebp_.jpg",
        },
        inStock: true,
        unit: "5kg",
      },
    ] as Product[],
  },
  {
    shopName: "Fresh Market",
    products: [
      {
        id: 4,
        title: "Fortune Sunlite Refined Sunflower Oil",
        price: 135,
        mrp: 150,
        image: {
          uri: "https://m.media-amazon.com/images/I/51rY1iA8sFL._SX300_SY300_QL70_FMwebp_.jpg",
        },
        inStock: true,
        unit: "1L",
      },
      {
        id: 5,
        title: "Maggi 2-Minute Instant Noodles",
        price: 140,
        mrp: 144,
        image: {
          uri: "https://m.media-amazon.com/images/I/81xU21pT6HL._SX300_SY300_QL70_FMwebp_.jpg",
        },
        inStock: true,
        unit: "840g",
      },
    ] as Product[],
  },
];

const MOCK_RESTAURANT_PRODUCTS = [
  {
    shopName: "Spicy Treats",
    products: [
      {
        id: "101",
        name: "Paneer Tikka Masala",
        description: "Delicious cottage cheese in rich tomato gravy.",
        price: 250,
        currency: "₹",
        dietaryType: "VEG",
        image: {
          uri: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=60",
        },
        isAvailable: true,
      },
      {
        id: "102",
        name: "Chicken Biryani",
        description:
          "Aromatic basmati rice cooked with tender chicken and spices.",
        price: 350,
        currency: "₹",
        dietaryType: "NON_VEG",
        image: {
          uri: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=60",
        },
        isAvailable: true,
      },
    ] as any[],
  },
];

const SaveProducts = () => {
  const [activeCategory, setActiveCategory] = useState(
    FAVORITE_CATEGORIES[0].title,
  );

  const activeData =
    activeCategory === "Grocery & Essentials"
      ? MOCK_GROCERY_SHOPS_PRODUCTS
      : MOCK_RESTAURANT_PRODUCTS;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Saved Products" back border />

      {/* Category Chips */}
      <View className="flex-row mx-4 mt-4 mb-3 gap-3 justify-start">
        {FAVORITE_CATEGORIES.map((category, index) => {
          const isActive = activeCategory === category.title;
          const isRestaurant = category.title === "Food & Restaurant";

          let activeBg = "bg-[#B7ECCD]";
          if (isRestaurant) {
            activeBg = "bg-black";
          }

          return (
            <Pressable
              key={index}
              onPress={() => setActiveCategory(category.title)}
              className={`h-17 w-17 p-2 border rounded-xl items-center justify-center ${
                isActive
                  ? "border-gray-400 " + activeBg
                  : "border-gray-300 bg-white"
              }`}
            >
              <Image
                source={category.icon}
                className="h-10 w-10"
                resizeMode="contain"
              />
            </Pressable>
          );
        })}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-10 mt-2">
          {activeData.map((shop, shopIndex) => (
            <View key={shopIndex} className="mb-4">
              {/* Shop Header */}
              <View className="px-4 mb-3 flex-row items-center justify-between">
                <Text className="text-[18px] font-extrabold text-gray-900 tracking-tight">
                  {shop.shopName}
                </Text>
                <Pressable>
                  <Text className="text-[13px] font-bold text-orange-600">
                    View Store
                  </Text>
                </Pressable>
              </View>

              {/* Horizontal FlashList of Products */}
              <View
                className={
                  activeCategory === "Food & Restaurant"
                    ? "w-full min-h-[350px]"
                    : "w-full min-h-[240px]"
                }
              >
                <FlashList
                  data={shop.products}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  estimatedItemSize={
                    activeCategory === "Food & Restaurant" ? 172 : 112
                  }
                  contentContainerStyle={{
                    paddingHorizontal: 12,
                    paddingBottom: 16,
                    paddingTop: 4,
                  }}
                  ItemSeparatorComponent={() => <View className="w-3" />}
                  renderItem={({ item }) => {
                    if (activeCategory === "Food & Restaurant") {
                      return (
                        <View className="w-[140px]">
                          <FoodCard
                            item={item as any}
                            className="w-[140px]"
                            onPress={() => {}}
                          />
                        </View>
                      );
                    }
                    return (
                      <View className="w-[100px]">
                        <ProductCard
                          item={item as any}
                          quantity={0}
                          onAdd={() => {}}
                          onIncrement={() => {}}
                          onDecrement={() => {}}
                          width={100}
                        />
                      </View>
                    );
                  }}
                />
              </View>

              {shopIndex < activeData.length - 1 && (
                <View className="h-[1px] w-full bg-gray-100 mt-2" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SaveProducts;
