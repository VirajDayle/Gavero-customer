import { Coupon } from '@/src/types';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

// Custom Animated Dot Component for smooth transitions
export const PaginationDot = ({ index, activeIndex }: { index: number; activeIndex: number }) => {
  const isActive = index === activeIndex;
  
  // Shared values for smooth animation
  const width = useSharedValue(8);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    // Smoothly spring the width and ease the opacity when active state changes
    width.value = withSpring(isActive ? 20 : 8, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(isActive ? 1 : 0.3, { duration: 250 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          height: 5, // Slightly thicker for a more premium visual weight
          borderRadius: 4,
          backgroundColor: isActive ? '#ea580c' : '#9ca3af', // Matches the brand orange when active
        },
      ]}
      className="mx-1"
    />
  );
};



// Main Pagination Container
export const CouponPagination = ({ coupons, activeIndex }:{coupons: Coupon[], activeIndex: number}) => {
  return (
    <View className="flex-row items-center justify-center mt-2 h-2">
      {coupons.map((_, index) => (
        <PaginationDot 
          key={index} 
          index={index} 
          activeIndex={activeIndex} 
        />
      ))}
    </View>
  );
};