import React, { createContext, useContext } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

type TabBarContextType = {
  hideProgress: SharedValue<number>;
};

const TabBarContext = createContext<TabBarContextType | null>(null);

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
};

export const TabBarProvider = ({ children }: { children: React.ReactNode }) => {
  const hideProgress = useSharedValue(0);

  return (
    <TabBarContext.Provider value={{ hideProgress }}>
      {children}
    </TabBarContext.Provider>
  );
};
