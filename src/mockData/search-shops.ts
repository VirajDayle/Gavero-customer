export type ShopItem = {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviews: number;
  distance: string;
  deliveryTime: string;
  tags: string[];
  imageSource: any; // Using 'any' or 'ImageSourcePropType' for React Native compatibility
  isFastest?: boolean;
  couponCode?: string;
  isSaved?: boolean;
  isClosed?: boolean; // Marked as required here since the backend will explicitly send true/false
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

export type ListItem =
  | ShopItem
  | HeaderItem
  | HorizontalProducts
  | HorizontalBrands;

export const ACTIVE_SHOPS: ShopItem[] = [
  {
    id: "1",
    name: "Balaji Mart",
    tagline: "Everything you need, every day.",
    rating: 4.8,
    reviews: 124,
    distance: "1.2 km",
    deliveryTime: "15-20 min",
    tags: [
      "Grocery",
      "Restaurant",
      "Bakery",
      "Sweets",
      "Pharmacy",
      "Stationary",
      "Cosmetic",
      "Petfood",
      "Fruits",
    ],
    imageSource: require("@/src/assets/images/balajimart.png"),
    isFastest: true,
    couponCode: "SAVE20",
    isSaved: true,
  },
  {
    id: "2",
    name: "Sharma Kirana Store",
    tagline: "Farm fresh to your doorstep.",
    rating: 4.5,
    reviews: 89,
    distance: "2.5 km",
    deliveryTime: "25-30 min",
    tags: ["Fruits", "Vegetables", "Dairy", "Grocery"],
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "3",
    name: "Patidar Provision Store",
    tagline: "Your one-stop grocery shop.",
    rating: 4.2,
    reviews: 210,
    distance: "3.1 km",
    deliveryTime: "35-45 min",
    tags: ["Grocery", "Bakery", "Pharmacy", "Cosmetic", "Petfood", "Sweets"],
    imageSource: require("@/src/assets/images/balajimart.png"),
    couponCode: "WELCOME50",
  },
  {
    id: "4",
    name: "Green Valley Organics",
    tagline: "Pure, natural, and healthy.",
    rating: 4.9,
    reviews: 56,
    distance: "4.0 km",
    deliveryTime: "40-55 min",
    tags: ["Organic", "Farm Fresh"],
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "5",
    name: "Desi Basket Bazaar",
    tagline: "Baked with love.",
    rating: 4.7,
    reviews: 312,
    distance: "1.8 km",
    deliveryTime: "20-30 min",
    tags: ["Bakery", "Desserts"],
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "7",
    name: "Nature's Basket",
    tagline: "Premium quality groceries.",
    rating: 4.6,
    reviews: 420,
    distance: "3.5 km",
    deliveryTime: "30-45 min",
    tags: ["Gourmet", "Organic"],
    imageSource: require("@/src/assets/images/balajimart.png"),
    couponCode: "FRESH10",
  },
  {
    id: "8",
    name: "Quick Pick Grocery",
    tagline: "Fast and convenient.",
    rating: 4.0,
    reviews: 78,
    distance: "0.8 km",
    deliveryTime: "10-15 min",
    tags: ["Convenience", "Snacks"],
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "9",
    name: "Gupta Sweets",
    tagline: "Authentic Indian sweets.",
    rating: 4.3,
    reviews: 150,
    distance: "2.1 km",
    deliveryTime: "25-35 min",
    tags: ["Sweets", "Desserts", "Bakery"],
    imageSource: require("@/src/assets/images/balajimart.png"),
    isClosed: true,
  },
  {
    id: "10",
    name: "Midnight Cravings",
    tagline: "Late night snacks delivered.",
    rating: 4.1,
    reviews: 320,
    distance: "4.5 km",
    deliveryTime: "40-50 min",
    tags: ["Snacks", "Fast Food"],
    imageSource: require("@/src/assets/images/balajimart.png"),
    isClosed: true,
  },
  {
    id: "11",
    name: "Rajdhani Thali",
    tagline: "Authentic Rajasthani meals.",
    rating: 4.5,
    reviews: 540,
    distance: "3.2 km",
    deliveryTime: "35-45 min",
    tags: ["Restaurant", "Meals"],
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "12",
    name: "Evergreen Florist",
    tagline: "Fresh flowers for every occasion.",
    rating: 4.8,
    reviews: 95,
    distance: "1.5 km",
    deliveryTime: "20-30 min",
    tags: ["Flowers", "Gifts"],
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "13",
    name: "Kalyan Jewellers",
    tagline: "Trust is everything.",
    rating: 4.9,
    reviews: 800,
    distance: "5.0 km",
    deliveryTime: "N/A",
    tags: ["Jewellery", "Gifts"],
    imageSource: require("@/src/assets/images/balajimart.png"),
    isClosed: true,
  },
  {
    id: "14",
    name: "Pooja Supermart",
    tagline: "Daily essentials delivered fast.",
    rating: 4.2,
    reviews: 210,
    distance: "2.8 km",
    deliveryTime: "30-40 min",
    tags: ["Grocery", "Dairy"],
    imageSource: require("@/src/assets/images/balajimart.png"),
    isClosed: true,
  },
  {
    id: "15",
    name: "Burger Point",
    tagline: "Best burgers in town.",
    rating: 4.4,
    reviews: 430,
    distance: "3.5 km",
    deliveryTime: "40-55 min",
    tags: ["Fast Food", "Snacks"],
    imageSource: require("@/src/assets/images/balajimart.png"),
    isClosed: true,
  },
];

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: "p1",
    name: "Amul Butter 500g",
    price: "₹255",
    originalPrice: "₹270",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "p2",
    name: "Lays Classic Salted",
    price: "₹20",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "p3",
    name: "Aashirvaad Atta 5kg",
    price: "₹210",
    originalPrice: "₹235",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "p4",
    name: "Maggi 2-Min Noodles",
    price: "₹14",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "p5",
    name: "Coca Cola 1L",
    price: "₹45",
    originalPrice: "₹50",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
];

export const MOCK_BRANDS: BrandItem[] = [
  {
    id: "b1",
    name: "Amul",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "b2",
    name: "Nestle",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "b3",
    name: "ITC",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "b4",
    name: "Parle",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
  {
    id: "b5",
    name: "Britannia",
    imageSource: require("@/src/assets/images/balajimart.png"),
  },
];
