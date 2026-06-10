import GroceryShop from "@/src/components/shops/GroceryShop";
import RestaurantShop from "@/src/components/shops/RestaurantShop";

export type ShopType = "Grocery" | "Restaurant";

export const SHOP_FACES = {
  Grocery: GroceryShop,
  Restaurant: RestaurantShop,
} as const;
