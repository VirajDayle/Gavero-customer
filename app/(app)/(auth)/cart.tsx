import Header from "@/src/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// Types matching your setup
export type Product = {
  id: string;
  image: string;
  name: string;
};

export type ShopCategoryItem = {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  iconActive: ImageSourcePropType;
  color?: string;
  textColor?: string;
};

interface CategoriesData {
  data: ShopCategoryItem;
  products: Product[];
}

interface CartCardProps {
  name: string;
  logo: ImageSourcePropType;
  data: CategoriesData[];
}

const CartCard = ({ name, logo, data = [] }: CartCardProps) => {
  return (
    <View className="border border-gray-200 p-3 rounded-xl bg-white mb-3">
      {/* Shop Header Info */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
            <Image source={logo} className="h-full w-full" resizeMode="cover" />
          </View>
          <Text
            className="text-[15px] font-semibold text-gray-900"
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
        <Pressable
          className="p-1 active:opacity-60"
          onPress={() => {
            Alert.alert(
              "Delete Cart",
              "Do you really want to delete this cart?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    // Delete logic goes here
                  },
                },
              ],
            );
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#4B5563" />
        </Pressable>
      </View>

      {/* Categories Content: Loops and creates a separate horizontal row for each category */}
      <View className="gap-2">
        {data.map((categoryGroup) => {
          const category = categoryGroup.data;
          const products = categoryGroup.products;

          // ✅ Skip rendering the entire row if no products
          if (products.length === 0) return null;

          return (
            <View
              key={category.id}
              className="flex-row items-center justify-between border border-gray-200 rounded-xl p-3 bg-white"
            >
              {/* Left: Category Icon (Static single item per row) */}
              <View className="w-11 h-11 items-center justify-center ">
                {/* Defaulting to iconActive since it represents an item present in the cart */}
                <Image
                  source={category.iconActive}
                  className="h-9 w-9"
                  resizeMode="contain"
                />
              </View>

              {/* First Vertical Separator */}
              <View className="border-r border-gray-200 h-8 mx-2" />

              {/* Center: Product Images List (Horizontal Scroll) */}
              <View className="flex-1 min-h-12 justify-center">
                {products.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 6, alignItems: "center" }}
                  >
                    {products.map((product) => (
                      <View
                        key={product.id}
                        className="h-11 w-11 rounded-md overflow-hidden bg-white border border-gray-100"
                      >
                        <Image
                          source={{ uri: product.image }}
                          className="h-full w-full"
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <Text className="text-xs text-gray-400 italic pl-1">
                    No items
                  </Text>
                )}
              </View>

              {/* Second Vertical Separator */}
              <View className="border-r border-gray-200 h-8 mx-2" />

              {/* Right: Total Items Count for this Category */}
              <View className="items-center justify-center min-w-10">
                <Text className="text-base font-bold text-gray-800 leading-none">
                  {products.length}
                </Text>
                <Text className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">
                  items
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer Interactive Actions */}
      <View className="flex-row items-center justify-between mt-3 gap-3">
        <Pressable className="flex-1 rounded-xl py-2.5 flex-row items-center justify-center active:opacity-80 bg-gray-100 border border-gray-200">
          <Text className="font-bold text-sm text-gray-700">
            Add More Items
          </Text>
        </Pressable>

        <Pressable
          className="flex-1 rounded-xl py-2.5 flex-row items-center justify-center active:opacity-80 bg-zinc-800"
          onPress={() => router.push("/(app)/(auth)/view-cart")}
        >
          <Text className="text-sm text-white font-bold">View Cart</Text>
        </Pressable>
      </View>
    </View>
  );
};

// Main Screen view container with simulated structured mock data
const CartScreen = () => {
  const sampleCartData: CartCardProps[] = [
    {
      name: "Reliance Mart",
      logo: {
        uri: "data:image/png;base64,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",
      },
      data: [
        {
          data: {
            id: "Grocery",
            title: "Grocery",
            icon: require("@/src/assets/images/shopCategeory/groceryActive.png"),
            iconActive: require("@/src/assets/images/shopCategeory/groceryActive.png"),
            color: "#FFEDD5", // optional accent bg color
          },
          products: [
            {
              id: "p1",
              name: "Maggi",
              image:
                "https://m.media-amazon.com/images/I/512JnR0o-TL._SY300_SX300_QL70_FMwebp_.jpg",
            },
            {
              id: "p2",
              name: "Pasta",
              image:
                "https://m.media-amazon.com/images/I/41lJsEF71RL._SY300_SX300_QL70_FMwebp_.jpg",
            },
            {
              id: "p3",
              name: "Sauce",
              image:
                "https://m.media-amazon.com/images/I/41DTk7Du2rL._SY300_SX300_QL70_FMwebp_.jpg",
            },
            {
              id: "p4",
              name: "Oil",
              image:
                "https://m.media-amazon.com/images/I/81PqVakmwPL._SL1500_.jpg",
            },
            {
              id: "p5",
              name: "Oil",
              image:
                "https://m.media-amazon.com/images/I/81PqVakmwPL._SL1500_.jpg",
            },
          ],
        },
        {
          data: {
            id: "Restaurant",
            title: "Food",
            icon: require("@/src/assets/images/shopCategeory/restaurant.png"),
            iconActive: require("@/src/assets/images/shopCategeory/restaurant.png"),
            color: "#FEE2E2", // optional accent bg color
          },
          products: [
            {
              id: "p5",
              name: "Noodles",
              image:
                "https://shwetainthekitchen.com/wp-content/uploads/2023/03/vegetable-noodles.jpg",
            },
          ],
        },
      ],
    },
    {
      name: "Pizza Hut",
      logo: {
        uri: "https://images.unsplash.com/photo-1615719417309-025fc64f2c8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      data: [
        {
          data: {
            id: "Restaurant",
            title: "Food",
            icon: require("@/src/assets/images/shopCategeory/restaurant.png"),
            iconActive: require("@/src/assets/images/shopCategeory/restaurant.png"),
            color: "#FEE2E2",
          },
          products: [
            {
              id: "p6",
              name: "Margherita",
              image:
                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            },
            {
              id: "p7",
              name: "Pepperoni",
              image:
                "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            },
          ],
        },
      ],
    },
    {
      name: "Fresh Farms Grocery",
      logo: {
        uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      data: [
        {
          data: {
            id: "Grocery",
            title: "Grocery",
            icon: require("@/src/assets/images/shopCategeory/groceryActive.png"),
            iconActive: require("@/src/assets/images/shopCategeory/groceryActive.png"),
            color: "#FFEDD5",
          },
          products: [
            {
              id: "p8",
              name: "Apples",
              image:
                "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            },
            {
              id: "p9",
              name: "Bananas",
              image:
                "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            },
            {
              id: "p10",
              name: "Milk",
              image:
                "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            },
          ],
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Carts" back border />
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {sampleCartData.map((cart, idx) => (
          <CartCard
            key={idx}
            name={cart.name}
            logo={cart.logo}
            data={cart.data}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;
