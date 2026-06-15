import { Coupon } from "@/src/types";

export const MOCK_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "FRESH100",
    description: "Flat ₹100 OFF on orders above ₹499",
    category: "Fruits & Vegetables",
    terms:
      "Valid only on fresh organic fruits and seasonal vegetables. Minimum cart value must be ₹499 before taxes. Cannot be combined with other ongoing bundle deals.",
    imageType: "fruits",
  },
  {
    id: "2",
    code: "DAIRY20",
    description: "20% OFF up to ₹75 on Breakfast Essentials",
    category: "Dairy & Breakfast",
    terms:
      "Maximum discount capped at ₹75. Applicable on milk, butter, cheese, bread, and eggs. Minimum transaction value of ₹199 required.",
    imageType: "dairy",
  },
  {
    id: "3",
    code: "CRUNCH30",
    description: "30% OFF up to ₹120 above ₹399",
    category: "Snacks & Munchies",
    terms:
      "Valid on chips, biscuits, chocolates, and cold beverages. Offer valid twice per user account per week. Not applicable on bulk combo packs.",
    imageType: "snacks",
  },
  {
    id: "4",
    code: "CLEANUP",
    description: "Flat ₹150 OFF on orders above ₹799",
    category: "Household & Cleaning",
    terms:
      "Applicability covers laundry detergents, surface cleaners, and dishwashing liquids. Minimum purchase requirement of ₹799 on items within this category.",
    imageType: "snacks",
  },
  {
    id: "5",
    code: "FREEPACK",
    description: "Buy 1 Get 1 Free on Gourmet Meats",
    category: "Meat & Seafood",
    terms:
      "Add two eligible items from the Meat & Seafood collection to your cart. The lowest-priced item will be automatically discounted to ₹0 at final checkout.",
    imageType: "meat",
  },
];
