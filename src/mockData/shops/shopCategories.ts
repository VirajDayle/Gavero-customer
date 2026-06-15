import type { ShopCategoryItem } from "@/src/types/category";

/**
 * All top-level shop category tabs shown in ShopHeader.
 * The `color` field is used as the active chip background in the header.
 */
export const SHOP_CATEGORIES: ShopCategoryItem[] = [
  {
    id: "3",
    iconActive: require("@/src/assets/images/shopCategeory/restaurant.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Food",
    color: "#000000", // Tomato Red - perfect for food cravings
    textColor: "#FFFFFF",
    isActive: true,
  },
  {
    id: "1",
    iconActive: require("@/src/assets/images/shopCategeory/groceryActive.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Grocery",
    color: "#016630",
    textColor: "#FFFFFF",
    isActive: true,
  },
  {
    id: "4",
    iconActive: require("@/src/assets/images/shopCategeory/pharmacy.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Pharmacy",
  },
  {
    id: "5",
    iconActive: require("@/src/assets/images/shopCategeory/stationary.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Stationary",
  },
  {
    id: "7",
    iconActive: require("@/src/assets/images/shopCategeory/cosmetics.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Cosmetics",
  },
  {
    id: "8",
    iconActive: require("@/src/assets/images/shopCategeory/petfood.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Petfood",
  },
];
