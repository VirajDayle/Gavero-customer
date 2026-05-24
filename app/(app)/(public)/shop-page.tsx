import ShopHeader from '@/src/components/ui/ShopHeader';
import { styled } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);
const ShopPage = () => {
  return (
    <View>
      <ShopHeader />
    </View>
  )
}

export default ShopPage;