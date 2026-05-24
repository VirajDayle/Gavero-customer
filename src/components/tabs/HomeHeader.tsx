import { SELECT_ADDRESS } from "@/src/constants/selectAddress";
import { SHOP_CATEGORIES } from "@/src/constants/shopCategeory";
import Ionicons from "@expo/vector-icons/Ionicons";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import SearchBar from "../ui/SearchBar";
import AddressDropdown from "./AddressDropdown";
import ShopCategories from "./ShopCategeories";

export interface HomeHeaderProps {
  className?: string;
  /** 0 = fully expanded, 1 = fully collapsed (address row hidden) */
  scrollProgress: SharedValue<number>;
}

const HomeHeader = ({ className, scrollProgress }: HomeHeaderProps) => {
  const addressRef = useRef<View>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);

  // Measured height of the top row — set once via onLayout
  const topRowHeight = useRef(0);
  const hasMeasured = useRef(false);

  // Shared value mirror so worklets can read it
  const topRowHeightSV = useRef<SharedValue<number> | null>(null);
  // We create it lazily — but SharedValues must be created at hook level.
  // We'll use a regular JS ref and re-use the interpolation range after first measure.
  // Keep a state to force re-render after measurement so style picks up the value.
  const [measuredHeight, setMeasuredHeight] = useState(0);

  const handleAddressPress = () => {
    addressRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
      setDropdownTop(pageY + _height + 6);
      setModalVisible(true);
    });
  };

  const handleTopRowLayout = (e: LayoutChangeEvent) => {
    if (hasMeasured.current) return;
    const { height } = e.nativeEvent.layout;
    if (height > 0) {
      hasMeasured.current = true;
      setMeasuredHeight(height);
    }
  };

  // Clip the top row height to 0 when collapsed
  const clipStyle = useAnimatedStyle(() => {
    if (measuredHeight === 0) return { overflow: "hidden" };
    return {
      height: interpolate(scrollProgress.value, [0, 1], [measuredHeight, 0]),
      marginBottom: interpolate(scrollProgress.value, [0, 1], [8, 0]),
      overflow: "hidden",
    };
  }, [measuredHeight]);

  // Address section slides out to the left
  const addressStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(scrollProgress.value, [0, 1], [0, -200]) },
    ],
    opacity: interpolate(scrollProgress.value, [0, 1], [1, 0]),
  }));

  // Action buttons slide out to the right
  const actionsStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(scrollProgress.value, [0, 1], [0, 120]) },
    ],
    opacity: interpolate(scrollProgress.value, [0, 1], [1, 0]),
  }));

  return (
    <View className={clsx(className, "px-4 pt-3 pb-4")}>
      {/* ── Collapsible top row (address + action icons) ── */}
      <Animated.View style={clipStyle}>
        <View
          onLayout={handleTopRowLayout}
          className="flex-row items-center justify-between"
        >
          {/* Address — slides left on collapse */}
          <Animated.View style={[addressStyle, { flex: 1, marginRight: 12 }]}>
            <Pressable ref={addressRef} onPress={handleAddressPress}>
              <Text
                numberOfLines={1}
                className="text-[15px] font-semibold text-gray-900"
              >
                89 Tilak Marg, Barwaha, Madhya Pradesh
              </Text>
              <Text
                numberOfLines={1}
                className="self-start mt-0.5 text-xs text-gray-900 bg-amber-200 py-px px-0.75 rounded-br-lg rounded-tr-lg border-amber-300 border-[0.5]"
              >
                12 km away from your current location
              </Text>
            </Pressable>
          </Animated.View>

          {/* Action icons — slide right on collapse */}
          <Animated.View
            className="flex-row items-center gap-2"
            style={actionsStyle}
          >
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#111827"
              />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Ionicons name="cart-outline" size={22} color="#111827" />
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>

      <AddressDropdown
        visible={modalVisible}
        dropdownTop={dropdownTop}
        addresses={SELECT_ADDRESS}
        onClose={() => setModalVisible(false)}
        onSelect={() => setModalVisible(false)}
        onDelete={(_id) => {}}
      />

      {/* ── Always visible: SearchBar + ShopCategories ── */}
      <View style={{ gap: 8 }}>
        <SearchBar
          placeholderAnimation={{
            textList: [
              "Panchwati Restaurant",
              "Khandelwal Bakery",
              "Paratha Junction",
              "Jayanti Cafe",
            ],
            delay: 2000,
          }}
          editable={false}
        />
        <ShopCategories items={SHOP_CATEGORIES} />
      </View>
    </View>
  );
};

export default HomeHeader;
