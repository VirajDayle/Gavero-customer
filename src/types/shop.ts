import GroceryShop from "@/src/components/shops/GroceryShop";
import RestaurantShop from "@/src/components/shops/RestaurantShop";

export type ShopType = "Grocery" | "Food";

export const SHOP_FACES = {
  Grocery: GroceryShop,
  Food: RestaurantShop,
} as const;
