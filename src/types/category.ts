import { ImageSourcePropType } from "react-native";

/** A top-level shop category (Grocery, Restaurant, Pharmacy, etc.) */
export type ShopCategoryItem = {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  iconActive: ImageSourcePropType;
  /** Optional accent color used for active chip background */
  color?: string;
  /** Optional text color used for active chip text */
  textColor?: string;
};
