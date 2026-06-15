import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

// Defined outside component to prevent re-creation on every render
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Super-Marcado": require("../src/assets/fonts/SupermercadoOne-Regular.ttf"),
    "Lato-Bold": require("../src/assets/fonts/Lato-Bold.ttf"),
    "Roboto-Bold": require("../src/assets/fonts/Roboto-BoldItalic.ttf"),
    "Sans-Regular": require("../src/assets/fonts/GoogleSans-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
        // Prevent uncaught promise rejections on fast refresh / hot reloads
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* StatusBar style — stable, does not trigger window inset re-layouts */}
      <StatusBar style="dark" />
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={MyTheme}>
            <BottomSheetModalProvider>
              <Slot />
            </BottomSheetModalProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
