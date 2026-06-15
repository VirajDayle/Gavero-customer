export type ShopItem = {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviews: number;
  distance: string;
  deliveryTime: string;
  tags: string[];
  imageSource: any;
  isFastest?: boolean;
  couponCode?: string;
  isSaved?: boolean;
  isClosed?: boolean;
};

export type RestaurantCardData = {
  itemName: string;
  price: number;
  imageUrl?: any;
  isVeg: boolean;
};

export type RestaurantItem = {
  id: string;
  name: string;
  deliveryTime: string;
  rating: number;
  tags: string[];
  data: RestaurantCardData[];
  distance: string;
  isSaved?: boolean;
  isFastest?: boolean;
  couponCode?: string;
  isClosed?: boolean;
};


export type HeaderItem = {
  type: "header";
  title: string;
  id: string;
};

export type ProductItem = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  imageSource: any;
};

export type BrandItem = {
  id: string;
  name: string;
  imageSource: any;
};

export type HorizontalProducts = {
  type: "horizontal_products";
  id: string;
  products: ProductItem[];
};

export type HorizontalBrands = {
  type: "horizontal_brands";
  id: string;
  brands: BrandItem[];
};

export type HorizontalShops = {
  type: "horizontal_shops";
  id: string;
  shops: ShopItem[];
};

export type HorizontalRestaurants = {
  type: "horizontal_restaurants";
  id: string;
  restaurants: RestaurantItem[];
};

export type SearchListItem =
  | ShopItem
  | HeaderItem
  | HorizontalProducts
  | HorizontalBrands
  | HorizontalShops
  | HorizontalRestaurants
  | RestaurantItem;
