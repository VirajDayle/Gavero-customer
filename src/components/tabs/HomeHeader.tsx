import { SELECT_ADDRESS } from "@/src/constants/selectAddress";
import { SHOP_CATEGORIES } from "@/src/constants/shopCategeory";
import { SEARCH_PLACEHOLDERS } from "@/src/constants/tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Search from "../ui/Search";
import AddressDropdown from "./AddressDropdown";
import ShopCategories from "./ShopCategeories";

export interface HomeHeaderProps {
  className?: string;
}

const HomeHeader = ({ className }: HomeHeaderProps) => {
  const addressRef = useRef<View>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);

  const handleAddressPress = () => {
    addressRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
      setDropdownTop(pageY + _height + 6);
      setModalVisible(true);
    });
  };

  return (
    <View className={clsx(className, "gap-4 px-4 pt-3 pb-4")}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between">
        {/* Address Section */}
        <Pressable
          ref={addressRef} // 👈 attach ref here
          onPress={handleAddressPress}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          className="flex-1 mr-3"
        >
          <View className="flex-row items-center">
            <Text
              numberOfLines={1}
              className="flex-1 text-[15px] font-semibold text-gray-900"
            >
              89 Tilak Marg, Barwaha, Madhya Pradesh
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="self-start mt-0.5 text-xs text-gray-900 bg-amber-200 py-px px-0.75 rounded-br-lg rounded-tr-lg border-amber-300 border-[0.5]"
          >
            12 km away from your current location
          </Text>
        </Pressable>

        {/* Actions */}
        <View className="flex-row items-center gap-2">
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Ionicons name="notifications-outline" size={22} color="#111827" />
          </Pressable>
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Ionicons name="cart-outline" size={22} color="#111827" />
          </Pressable>
        </View>
      </View>
      <AddressDropdown
        visible={modalVisible}
        dropdownTop={dropdownTop}
        addresses={SELECT_ADDRESS}
        onClose={() => setModalVisible(false)}
        onSelect={(address) => {
          setModalVisible(false);
          // update active address in store
        }}
        onDelete={(id) => {
          // call delete API
        }}
      />
      <Search placeholders={SEARCH_PLACEHOLDERS} />
      <ShopCategories items={SHOP_CATEGORIES} />
    </View>
  );
};

export default HomeHeader;
