import { ImageSourcePropType } from "react-native";

export type Product = {
  id: number;
  title: string;
  image?: ImageSourcePropType | string;
  price: number;
  mrp: number;
  unit: string;
  inStock: boolean;
  shopName?: string;
};

export type CartItem = {
  productId: number;
  quantity: number;
};

export type Cart = Record<number, number>;
