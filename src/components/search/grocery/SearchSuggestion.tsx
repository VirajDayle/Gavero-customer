import { MoveUpLeft } from "lucide-react-native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const SUGGESTIONS = {
  suggestions: [
    {
      type: "brand",
      label: "Maggi",
      sub_label: "in Brand",
      brand_id: "brand_maggi_001",
      brand_slug: "maggi",
      brand_logo: "https://cdn.gavero.in/brands/maggi.png",
      product_count: 14,
    },
    {
      type: "query",
      label: "Maggi Noodles",
      query: "maggi noodles",
      sub_category_id: "subcat_instant_noodles",
      sub_category_name: "Instant Noodles",
      popularity: 1240,
      icon: "search",
    },
    {
      type: "query",
      label: "Maggi Masala",
      query: "maggi masala",
      sub_category_id: "subcat_instant_noodles",
      sub_category_name: "Instant Noodles",
      popularity: 980,
      icon: "search",
    },
    {
      type: "query",
      label: "Maggi Atta Noodles",
      query: "maggi atta noodles",
      sub_category_id: "subcat_instant_noodles",
      sub_category_name: "Instant Noodles",
      popularity: 430,
      icon: "search",
    },
    {
      type: "show_all",
      label: 'Show all results for "maggi"',
      query: "maggi",
      icon: "arrow-right",
    },
  ],

  meta: {
    query: "maggi",
    city: "indore",
    response_time_ms: 34,
  },
};

const Products = [
  {
    name: "Maggi",
    image: "https://m.media-amazon.com/images/I/81kD9TwLGaS._SL1500_.jpg",
  },
  {
    name: "Masala maggi",
    image: "https://m.media-amazon.com/images/I/719nAO+UEwL._SL1500_.jpg",
  },
  {
    name: "Atta maggi",
    image: "https://m.media-amazon.com/images/I/718bT19y+eL._SL1500_.jpg",
  },
  {
    name: "Maggi noodles",
    image: "https://m.media-amazon.com/images/I/71wxnbLOK6L._SL1500_.jpg",
  },
  {
    name: "Maggi pichkoo",
    image: "https://m.media-amazon.com/images/I/71fP66+Wl8L._SL1500_.jpg",
  },
];

interface SearchSuggestionProps {
  onSelect?: (text: string) => void;
}

const SearchSuggestion = ({ onSelect }: SearchSuggestionProps) => {
  return (
    <View className="bg-green-50 py-2 px-4 gap-1">
      {Products.map((item) => (
        <Pressable
          className="flex-row items-center justify-between"
          key={item.name}
          onPress={() => onSelect?.(item.name)}
        >
          <View className="flex-row items-center gap-2">
            <View className="h-10 w-10 bg-white rounded-md border border-gray-200 p-1 items-center justify-center">
              <Image
                source={{ uri: item.image }}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>
            <Text className="text-[16.5px] font-medium">{item.name}</Text>
          </View>
          <MoveUpLeft size={16} />
        </Pressable>
      ))}
    </View>
  );
};

export default SearchSuggestion;
