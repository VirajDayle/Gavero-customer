import GroceryShop from "@/src/components/shops/GroceryShop";
import RestaurantShop from "@/src/components/shops/RestaurantShop";

export const SHOP_FACES = {
  Grocery: GroceryShop,
  Restaurant: RestaurantShop,
} as const;

export type ShopType = keyof typeof SHOP_FACES;
