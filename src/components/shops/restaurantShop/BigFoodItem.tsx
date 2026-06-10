import { Ionicons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import clsx from "clsx";
import React, { useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import { ScrollView as GHScrollView } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedGHScrollView = Animated.createAnimatedComponent(GHScrollView);

const { width: FullWidth } = Dimensions.get("window");
const CARD_WIDTH = FullWidth - 24; // padding horizontal 12 on each side (mx-3)
const SNAP_INTERVAL = FullWidth;
const THUMBNAIL_SPACING = 66;

export interface PizzaOption {
  id: string;
  name: string;
  price: number;
  oldPrice?: number; // Optional, in case some items don't have a discount
}

export interface MenuItemProps {
  name: string;
  description: string;
  price: number;
  currency: "INR" | "USD" | string; // Strict or flexible string type
  dietaryType: "VEG" | "NON-VEG" | "EGG" | "EGGLESS"; // Enum-like string literal
  image: string;
  isAvailable: boolean;
  options: PizzaOption[];
}

const MOCK_DATA_LIST: MenuItemProps[] = [
  {
    name: "Margherita Pizza",
    description:
      "A classic Neapolitan pizza with fresh mozzarella, basil, and tomato sauce.",
    price: 149,
    currency: "INR",
    dietaryType: "VEG",
    image:
      "https://www.dominos.co.in/blog/wp-content/uploads/2019/12/third.jpg",
    isAvailable: true,
    options: [
      { id: "regular", name: "Regular", price: 149, oldPrice: 199 },
      { id: "medium", name: "Medium", price: 249, oldPrice: 299 },
      { id: "large", name: "Large", price: 349, oldPrice: 399 },
    ],
  },
  {
    name: "Spicy Chicken Burger",
    description:
      "Crispy chicken breast topped with spicy mayo, lettuce, and pickles on a toasted brioche bun.",
    price: 179,
    currency: "INR",
    dietaryType: "NON-VEG",
    image:
      "https://www.allrecipes.com/thmb/zOcniiv0VTR6iEKRk__IrUtrRlE=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-232375-Natashas-Chicken-Burgers-DDMFS-4x3-9e38dbcfe07449909179ab8ae8552f92.jpg",
    isAvailable: true,
    options: [
      { id: "single", name: "Single Patty", price: 179, oldPrice: 219 },
      { id: "double", name: "Double Patty", price: 239, oldPrice: 289 },
    ],
  },
  {
    name: "Paneer Tikka Roll",
    description:
      "Grilled cottage cheese cubes marinated in spices, wrapped in a flaky paratha with mint chutney.",
    price: 120,
    currency: "INR",
    dietaryType: "VEG",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7TIaFdtluSmnTBP6HHr5hoo6FQxO08svyCg&s",
    isAvailable: true,
    options: [
      { id: "standard", name: "Standard Roll", price: 120, oldPrice: 150 },
      { id: "double_paneer", name: "Double Paneer", price: 160, oldPrice: 199 },
    ],
  },
  {
    name: "Chocolate Lava Cake",
    description:
      "Rich chocolate cake with a warm, luscious molten chocolate center.",
    price: 99,
    currency: "INR",
    dietaryType: "EGGLESS",
    image:
      "data:image/jpeg;base64,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",
    isAvailable: true,
    options: [
      { id: "single", name: "1 Unit", price: 99, oldPrice: 129 },
      { id: "pack_of_2", name: "Pack of 2", price: 179, oldPrice: 258 },
    ],
  },
  {
    name: "Loaded Nachos",
    description:
      "Crispy tortilla chips smothered in warm cheese sauce, jalapenos, olives, and sour cream.",
    price: 199,
    currency: "INR",
    dietaryType: "VEG",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE9-bpEaU96DWBgD_ptCua7q6_XWItabcKcw&s",
    isAvailable: false,
    options: [
      { id: "regular", name: "Regular Size", price: 199, oldPrice: 249 },
      { id: "large", name: "Large Shareable", price: 299, oldPrice: 359 },
    ],
  },
];

const AnimatedThumbnail = ({
  imageUrl,
  index,
  thumbScrollX,
  onPress,
}: {
  imageUrl: string;
  index: number;
  thumbScrollX: any;
  onPress: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const position = index - thumbScrollX.value / THUMBNAIL_SPACING;

    const size = interpolate(
      position,
      [-3, -2, -1, 0, 1, 2, 3],
      [32, 48, 48, 64, 48, 48, 32],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      position,
      [-3, -2, -1, 0, 1, 2, 3],
      [0, 0.6, 0.6, 1, 0.6, 0.6, 0],
      Extrapolation.CLAMP,
    );

    const borderColor = interpolateColor(
      position,
      [-1, 0, 1],
      ["#e5e7eb", "#d1d5db", "#e5e7eb"], // gray-200 for inactive, gray-300 for active
    );

    return {
      width: size,
      height: size,
      opacity,
      borderWidth: 1,
      borderColor,
    };
  });

  return (
    <Pressable
      style={{
        width: THUMBNAIL_SPACING,
        height: THUMBNAIL_SPACING,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          {
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "transparent",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          animatedStyle,
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </Animated.View>
    </Pressable>
  );
};

const FoodItemContent = ({
  name,
  description,
  price,
  currency,
  dietaryType,
  image,
  isAvailable,
  options,
}: MenuItemProps) => {
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(options[0].id);
  const selectedOption =
    options.find((o) => o.id === selectedOptionId) || options[0];

  return (
    <View className="flex-1 bg-white mt-[80px] rounded-t-3xl overflow-hidden shadow-sm shadow-black/10 border-t border-gray-100">
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Title Section */}
        <View className="mx-3 mt-3 mb-3">
          <View className="flex-row items-center mb-1.5">
            <View
              className={`border w-4 h-4 items-center justify-center rounded-sm mr-1.5 border-green-600`}
            >
              <View className={`w-2 h-2 rounded-full bg-green-600`} />
            </View>
            <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {dietaryType}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">{name}</Text>
        </View>

        {/* Image Section */}

        <View className="w-full h-64 px-3">
          <Image
            source={{ uri: image }}
            className="w-full h-full rounded-t-xl"
            resizeMode="cover"
          />
        </View>

        {/* Description Section */}
        <View className="mx-3 mt-1 border border-b p-3 rounded-b-xl border-gray-300 bg-gray-50/50">
          <Text className="text-[13px] font-medium text-gray-600 leading-relaxed">
            {description}
          </Text>
        </View>

        {/* Options Selection */}
        <View className="mx-3 mt-3 border border-gray-200 p-3.5 rounded-xl bg-white shadow-sm shadow-black/5">
          <Text className="text-[15px] font-bold text-gray-800 mb-3 tracking-tight">
            Select Size
          </Text>
          {options.map((option, index) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setSelectedOptionId(option.id)}
                className={clsx(
                  "flex-row items-center justify-between py-3.5",
                  index !== options.length - 1 && "border-b border-gray-100",
                )}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={clsx(
                      "w-5 h-5 rounded-full border-[1.5px] items-center justify-center",
                      isSelected ? "border-zinc-600" : "border-gray-300",
                    )}
                  >
                    {isSelected && (
                      <View className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                    )}
                  </View>
                  <Text
                    className={clsx(
                      "text-[15px]",
                      isSelected
                        ? "font-semibold text-gray-900"
                        : "font-medium text-gray-700",
                    )}
                  >
                    {option.name}
                  </Text>
                </View>
                <Text className="text-[15px] font-semibold text-gray-900">
                  ₹{option.price}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BottomSheetScrollView>

      {/* Bottom Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-3  border-t border-gray-100 shadow-sm flex-row gap-2 bg-white "
        // style={{ paddingBottom: Math.max(insets.botto}}
      >
        <View className="justify-center">
          <Text className="text-lg text-gray-800 font-bold">
            ₹{selectedOption.price}
          </Text>
          <Text className="text-xs text-gray-400 line-through">
            ₹{selectedOption.oldPrice}
          </Text>
        </View>
        <View className="h-12 flex-1">
          {quantity === 0 ? (
            <Pressable
              onPress={() => setQuantity(1)}
              className={clsx(
                "rounded-full h-full w-full flex-row items-center justify-center gap-2",
                "bg-zinc-800",
              )}
            >
              <Text className="text-lg text-white font-medium">
                Add to cart
              </Text>
            </Pressable>
          ) : (
            <View className="rounded-full h-full flex-row items-center justify-between px-6 bg-zinc-800 w-full">
              <Pressable
                onPress={() => setQuantity((q) => Math.max(0, q - 1))}
                hitSlop={10}
              >
                <Ionicons
                  name={quantity === 1 ? "trash-outline" : "remove"}
                  size={22}
                  color="white"
                />
              </Pressable>

              <Text className="text-lg text-white font-bold">{quantity}</Text>

              <Pressable onPress={() => setQuantity((q) => q + 1)} hitSlop={10}>
                <Ionicons name="add" size={22} color="white" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const BigFoodItem = ({ onClose }: { onClose?: () => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const thumbRef = useAnimatedRef<GHScrollView>();
  const thumbScrollX = useSharedValue(0);

  const thumbScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      thumbScrollX.value = event.contentOffset.x;
    },
  });

  useAnimatedReaction(
    () => Math.round(thumbScrollX.value / THUMBNAIL_SPACING),
    (index, prevIndex) => {
      if (index !== prevIndex && index >= 0 && index < MOCK_DATA_LIST.length) {
        runOnJS(setActiveIndex)(index);
      }
    },
  );

  const activeItem = MOCK_DATA_LIST[activeIndex] || MOCK_DATA_LIST[0];

  return (
    <View className="flex-1 bg-transparent pt-16">
      <View
        className="absolute top-0 left-0 right-0 items-center justify-center z-50"
        pointerEvents="box-none"
      >
        <Pressable onPress={onClose} className="bg-white/20 rounded-full p-1.5">
          <Ionicons name="close" size={28} color="white" />
        </Pressable>
      </View>

      <Animated.View
        className="absolute top-16 left-0 right-0 h-20 z-50 bg-transparent"
        pointerEvents="box-none"
      >
        <AnimatedGHScrollView
          ref={thumbRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={THUMBNAIL_SPACING}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: FullWidth / 2 - THUMBNAIL_SPACING / 2,
            alignItems: "center",
          }}
          onScroll={thumbScrollHandler}
          scrollEventThrottle={16}
        >
          {MOCK_DATA_LIST.map((item, index) => (
            <AnimatedThumbnail
              key={index}
              imageUrl={item.image}
              index={index}
              thumbScrollX={thumbScrollX}
              onPress={() => {
                thumbRef.current?.scrollTo({
                  x: index * THUMBNAIL_SPACING,
                  y: 0,
                  animated: true,
                });
              }}
            />
          ))}
        </AnimatedGHScrollView>
      </Animated.View>

      <FoodItemContent {...activeItem} />
    </View>
  );
};

export default BigFoodItem;
