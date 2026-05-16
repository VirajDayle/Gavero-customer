import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

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

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#ffffff", // This makes ALL screens default to pure white!
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={MyTheme}>
          <Slot />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
