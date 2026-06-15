import { useAnimatedScrollHandler, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTabBar } from '@/src/context/TabBarContext';

export const useScrollToHideTabBar = () => {
  const { hideProgress } = useTabBar();
  const lastScrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    'worklet';
    const currentY = event.contentOffset.y;
    
    // Hide when scrolling down, show when scrolling up
    if (currentY > lastScrollY.value && currentY > 50) {
      hideProgress.value = withTiming(1, { duration: 300 }); 
    } else if (currentY < lastScrollY.value || currentY <= 50) {
      hideProgress.value = withTiming(0, { duration: 300 });
    }
    
    lastScrollY.value = currentY;
  });

  return onScroll;
};
