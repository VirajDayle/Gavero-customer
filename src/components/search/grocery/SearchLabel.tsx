import React from "react";
import { Text, View } from "react-native";

interface SearchLabelProps {
  query: string;
  responseTime?: number;
}

const SearchLabel = ({ query }: SearchLabelProps) => {
  return (
    <View className="px-4 pt-2">
      <Text className="text-[16px] font-medium">
        Result from "<Text className="text-orange-500">{query.trim()}</Text>"
      </Text>
    </View>
  );
};

export default SearchLabel;
