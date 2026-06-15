import { X } from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const Products = [
  {
    name: "Organic Cow Ghee",
    image: "https://m.media-amazon.com/images/I/61Nl0I52HCL._SL1000_.jpg",
  },
  {
    name: "Paneer",
    image: "https://m.media-amazon.com/images/I/41-qX36s0hL.jpg",
  },
  {
    name: "Amul Bread",
  },
  {
    name: "Milk",
  },
  {
    name: "Dahi",
    image: "https://m.media-amazon.com/images/I/61a35O5B2HL._SL1500_.jpg",
  },
];

interface SearchHistoryProps {
  onSelect?: (text: string) => void;
}

const History = ({ onSelect }: SearchHistoryProps) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          gap: 12,
        }}
      >
        {Products.map((item) => (
          <Pressable
            key={item.name}
            onPress={() => onSelect?.(item.name)}
            className="flex-row items-center bg-white border border-gray-200 rounded-full py-1 pl-1 pr-3 "
          >
            {item.image && (
              <View className="h-8 w-8 bg-white rounded-full mr-2 items-center justify-center border border-gray-100 overflow-hidden">
                <Image
                  source={{ uri: item.image }}
                  className="h-6 w-6"
                  resizeMode="contain"
                />
              </View>
            )}
            <Text className="text-[14px] font-medium text-gray-800 mr-3">
              {item.name}
            </Text>
            <Pressable
              hitSlop={15}
              onPress={() => {
                // handle delete if needed
              }}
            >
              <X size={16} color="#9ca3af" />
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default History;
