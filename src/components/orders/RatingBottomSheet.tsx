import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface RatingBottomSheetProps {
  onClose?: () => void;
  shopName?: string;
  deliveryPartnerName?: string;
  deliveryMethod?: "DELIVERY" | "PICKUP";
}

const FEEDBACK_TAGS = [
  "Good Packaging",
  "Fresh Items",
  "Fast Delivery",
  "Polite Partner",
  "Value for Money",
  "Great Taste",
];

const RatingBottomSheet = forwardRef<BottomSheetModal, RatingBottomSheetProps>(
  (
    {
      onClose,
      shopName = "Balaji Mart",
      deliveryPartnerName = "Amit Sharma",
      deliveryMethod = "DELIVERY",
    },
    ref,
  ) => {
    const snapPoints = useMemo(() => ["90%"], []);

    const [shopRating, setShopRating] = useState(0);
    const [partnerRating, setPartnerRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const toggleTag = (tag: string) => {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    const renderStars = (rating: number, setRating: (r: number) => void) => {
      return (
        <View className="flex-row items-center gap-2 mt-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <View key={star} className="relative p-1">
              <Ionicons
                name={
                  rating >= star
                    ? "star"
                    : rating >= star - 0.5
                      ? "star-half"
                      : "star-outline"
                }
                size={44}
                color={rating >= star - 0.5 ? "#FFC107" : "#D1D5DB"}
              />
              <View className="absolute inset-0 flex-row">
                <Pressable
                  className="flex-1"
                  onPressIn={() => setRating(star - 0.5)}
                />
                <Pressable
                  className="flex-1"
                  onPressIn={() => setRating(star)}
                />
              </View>
            </View>
          ))}
        </View>
      );
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
        backgroundStyle={{ backgroundColor: "#F9FAFB", borderRadius: 24 }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <View className="flex-row justify-between items-center px-4 pb-3 pt-2 border-b border-gray-200 bg-[#F9FAFB]">
          <Text className="text-xl font-bold text-gray-900">
            Review Experience
          </Text>
          <Pressable
            onPress={() => {
              if (ref && typeof ref !== "function" && ref.current) {
                ref.current.dismiss();
              }
              onClose?.();
            }}
            className="h-8 w-8 bg-gray-200 items-center justify-center rounded-full active:opacity-70"
          >
            <Ionicons name="close" size={20} color="#4B5563" />
          </Pressable>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Shop Rating */}
          <View className="mb-4 mt-2 items-center">
            <Text className="text-[16px] font-extrabold text-gray-800 text-center">
              How was {shopName}?
            </Text>
            <Text className="text-[13px] text-gray-500 mt-1 text-center">
              Rate your overall experience with the shop
            </Text>
            {renderStars(shopRating, setShopRating)}
          </View>

          {/* Delivery Partner Rating */}
          {deliveryMethod === "DELIVERY" && (
            <View className="mb-4 items-center">
              <Text className="text-[16px] font-extrabold text-gray-800 text-center">
                How was the delivery?
              </Text>
              <Text className="text-[13px] text-gray-500 mt-1 text-center">
                Rate your delivery partner, {deliveryPartnerName}
              </Text>
              {renderStars(partnerRating, setPartnerRating)}
            </View>
          )}

          {/* Feedback Tags */}
          <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4">
            <Text className="text-[15px] font-bold text-gray-800 mb-3">
              What did you like?{" "}
              <Text className="font-normal text-gray-400">(Optional)</Text>
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {FEEDBACK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-full border ${
                      isSelected
                        ? "bg-blue-50 border-blue-400"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-[13px] font-medium ${
                        isSelected ? "text-blue-700" : "text-gray-600"
                      }`}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Text Review */}
          <View className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
            <Text className="text-[15px] font-bold text-gray-800 mb-2">
              Write a Review{" "}
              <Text className="font-normal text-gray-400">(Optional)</Text>
            </Text>
            <BottomSheetTextInput
              className="bg-gray-50 rounded-xl p-3 text-[14px] text-gray-800 border border-gray-200"
              placeholder="Tell us more about your experience..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={reviewText}
              onChangeText={setReviewText}
              style={{ minHeight: 70 }}
            />
          </View>

          {/* Submit Button */}
          <Pressable
            className="bg-[#1f2937] rounded-xl py-4 mt-2 items-center justify-center active:bg-gray-800 shadow-sm"
            onPress={() => {
              if (ref && typeof ref !== "function" && ref.current) {
                ref.current.dismiss();
              }
              onClose?.();
            }}
          >
            <Text className="text-white font-bold text-[16px] tracking-wide">
              Submit Feedback
            </Text>
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

export default RatingBottomSheet;
