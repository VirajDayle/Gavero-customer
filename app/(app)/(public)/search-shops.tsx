import GrocerySearch from "@/src/components/nearby/GrocerySearch";
import RestaurantSearch from "@/src/components/nearby/RestaurantSearch";
import { RestaurantBigcardProps } from "@/src/components/shops/restaurantShop/RestaurantBigcard";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const restaurantCard: RestaurantBigcardProps = {
  name: "Burger Hub",
  deliveryTime: "25-30 min",
  rating: 4.5,
  type: "Fast Food",
  distance: "1.8 km",
  isSaved: false,
  isFastest: true,
  couponCode: "SAVE20",
  isClosed: false,
  onSavePress: () => {},
  onPress: () => {},
  data: [
    {
      itemName: "Cheese Burger",
      price: 149,
      imageUrl: undefined as any,
      isVeg: true,
    },
    {
      itemName: "French Fries",
      price: 99,
      imageUrl: undefined as any,
      isVeg: true,
    },
    {
      itemName: "Coke",
      price: 49,
      imageUrl: undefined as any,
      isVeg: true,
    },
  ],
};

const SearchShops = () => {
  const { shopType } = useLocalSearchParams<{
    shopType: string;
  }>();

  switch (shopType) {
    case "Grocery":
      return <GrocerySearch />;

    case "Restaurant":
    case "Food":
      return <RestaurantSearch />;

    default:
      return null;
  }
};

export default SearchShops;
