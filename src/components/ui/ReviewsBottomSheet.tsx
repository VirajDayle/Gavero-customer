import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ReviewsBottomSheetProps {
  onClose?: () => void;
  rating?: number;
  totalReviews?: number;
  headerHeight?: number;
}

const MOCK_REVIEWS = [
  {
    id: 1,
    fullName: "Priya Sharma",
    rating: 5,
    date: "2 days ago",
    comment:
      "Excellent quality and very fresh groceries! Delivery was faster than expected.",
    verified: true,
  },
  {
    id: 2,
    fullName: "Rahul Verma",
    rating: 4,
    date: "1 week ago",
    comment:
      "Good products but one item was missing. Customer support resolved it quickly though.",
    verified: true,
  },
  {
    id: 3,
    fullName: "Sneha Patil",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "This is my go-to place for all daily needs. The bundle discounts are amazing!",
    verified: true,
  },
  {
    id: 4,
    fullName: "Amit Kumar",
    rating: 3,
    date: "1 month ago",
    comment:
      "Average experience. The delivery took a bit longer than the promised 25 mins.",
    verified: false,
  },
  {
    id: 5,
    fullName: "Neha Gupta",
    rating: 4,
    date: "1 month ago",
    comment: "Very convenient and good variety of products. Will order again.",
    verified: true,
  },
];

// Mock breakdown data for the summary section
const MOCK_BREAKDOWN = [
  { count: 5, percentage: 72 },
  { count: 4, percentage: 18 },
  { count: 3, percentage: 6 },
  { count: 2, percentage: 3 },
  { count: 1, percentage: 1 },
];

// A highly polished, compact rendering of stars for review rows
const CompactStars = ({
  rating,
  size = 12,
}: {
  rating: number;
  size?: number;
}) => {
  return (
    <View className="flex-row items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.round(rating) ? "star" : "star-outline"}
          size={size}
          color={star <= Math.round(rating) ? "#F59E0B" : "#D1D5DB"}
        />
      ))}
    </View>
  );
};

// Reusable, lightweight component optimized for lists
const ReviewCard = React.memo(
  ({ review }: { review: (typeof MOCK_REVIEWS)[0] }) => (
    <View className="py-3 border-b border-gray-100">
      <View className="flex-row justify-between items-start mb-1.5">
        <View className="flex-row items-center gap-2.5">
          {/* Compact Avatar */}
          <View className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center border border-slate-200">
            <Text className="text-slate-700 font-semibold text-xs">
              {review.fullName.charAt(0)}
            </Text>
          </View>
          <View>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs font-semibold text-gray-900">
                {review.fullName}
              </Text>
              {review.verified && (
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              )}
            </View>
            <Text className="text-[10px] text-gray-400">{review.date}</Text>
          </View>
        </View>

        {/* Row level rating badge */}
        <View className="flex-row items-center gap-1 bg-amber-50 px-1.5 py-[2px] rounded">
          <Text className="text-[10px] font-bold text-amber-700">
            {review.rating.toFixed(1)}
          </Text>
          <Ionicons name="star" size={9} color="#B45309" />
        </View>
      </View>

      {/* Compact, highly readable text layout */}
      <Text className="text-xs text-gray-600 leading-4 tracking-wide pl-1">
        {review.comment}
      </Text>
    </View>
  ),
);

const ReviewsBottomSheet = forwardRef<
  BottomSheetModal,
  ReviewsBottomSheetProps
>(({ onClose, rating = 4.4, totalReviews = 148, headerHeight = 120 }, ref) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => {
    return [height - headerHeight - 24];
  }, [height, headerHeight]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.2} // Standard ambient dimming overlay
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      enableOverDrag={false}
      enableContentPanningGesture={false}
      backgroundStyle={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleComponent={() => (
        <View className="items-center py-2.5 bg-white rounded-t-[20px]">
          <View className="w-10 h-1 bg-gray-200 rounded-full" />
        </View>
      )}
    >
      {/* Sticky Top Header */}
      <View className="flex-row justify-between items-center px-4 pb-3 border-b border-gray-100 bg-white">
        <View>
          <Text className="text-base font-bold text-gray-900 tracking-tight">
            Ratings & Reviews
          </Text>
          <Text className="text-[11px] text-gray-400 mt-0.5">
            Real feedback from verified buyers
          </Text>
        </View>
        <Pressable
          onPress={() => {
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current.dismiss();
            }
            onClose?.();
          }}
          className="h-7 w-7 bg-gray-100 items-center justify-center rounded-full active:opacity-70"
        >
          <Ionicons name="close" size={16} color="#4B5563" />
        </Pressable>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic Aggregated Rating Summary Block */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-slate-50/70 border-b border-gray-100">
          <View className="items-center justify-center w-[30%]">
            <Text className="text-3xl font-black text-gray-900 tracking-tighter">
              {rating.toFixed(1)}
            </Text>
            <CompactStars rating={rating} size={11} />
            <Text className="text-[10px] text-gray-400 font-medium mt-1">
              {totalReviews} reviews
            </Text>
          </View>

          {/* Graphical Breakdown Bars */}
          <View className="w-[65%] gap-[3px]">
            {MOCK_BREAKDOWN.map((item) => (
              <View key={item.count} className="flex-row items-center gap-2">
                <Text className="text-[10px] font-medium text-gray-500 w-2 text-right">
                  {item.count}
                </Text>
                <View className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </View>
                <Text className="text-[9px] text-gray-400 w-6 text-right">
                  {item.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews Core Feed List */}
        <View className="px-4 pt-2">
          {MOCK_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default ReviewsBottomSheet;
