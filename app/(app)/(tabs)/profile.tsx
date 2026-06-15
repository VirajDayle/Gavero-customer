import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useScrollToHideTabBar } from "@/src/hooks/useScrollToHideTabBar";
import CustomSwitch from "@/src/components/ui/CustomSwitch";
import ScreenView from "@/src/components/ui/ScreenView";

const PROFILE_LINKS = [
  {
    id: "addresses",
    icon: "location-outline",
    label: "Manage Addresses",
    sub: "Add, edit or delete delivery locations",
    route: "/(app)/(auth)/manage-addresses",
  },
  {
    id: "payments",
    icon: "card-outline",
    label: "Payment Methods",
    sub: "Manage your saved cards and wallets",
    route: "/(app)/(auth)/payment-methods",
  },
  {
    id: "support",
    icon: "help-buoy-outline",
    label: "Help & Support",
    sub: "FAQs and customer support",
    route: "/(app)/(auth)/help-support",
  },
];

const MORE_LINKS = [
  {
    id: "settings",
    icon: "settings-outline",
    label: "Settings",
    sub: "App preferences and privacy",
    route: "/(app)/(auth)/settings",
  },
  {
    id: "about",
    icon: "information-circle-outline",
    label: "About Gavero",
    sub: "Version details and legal terms",
    route: "/(app)/(auth)/about-us",
  },
];

const Profile = () => {
  const router = useRouter();
  const onScroll = useScrollToHideTabBar();
  const insets = useSafeAreaInsets();

  const dietarySheetRef = useRef<BottomSheetModal>(null);
  const [isFullyVegRestaurant, setIsFullyVegRestaurant] = useState(false);
  const [isVegFoodAnyRestaurant, setIsVegFoodAnyRestaurant] = useState(false);

  const dietarySnapPoints = useMemo(() => ["35%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          onPress: () => console.log("User confirmed log out"),
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  const LinkItem = ({ item }: { item: any }) => (
    <View className="mb-2">
      <Pressable
        className="p-2 bg-white rounded-xl border active:opacity-70"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
        }}
        onPress={() => router.push(item.route)}
      >
        <View className="flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center">
              <Ionicons name={item.icon as any} size={20} color="#1f2937" />
            </View>
            <View>
              <Text className="text-[14px] font-medium text-gray-800">
                {item.label}
              </Text>
              <Text className="text-[10px] font-normal text-gray-500">
                {item.sub}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={15} color="#6b7280" />
        </View>
      </Pressable>
    </View>
  );

  const userName = "John Doe";
  const userImage = null; // Set to a URL string if image exists

  return (
    <ScreenView style={{ backgroundColor: "#FAFAF7" }}>
      {/* Header Profile Section */}
      <View className="px-5 pb-4 items-center justify-center">
        <View
          className="h-20 w-20 rounded-full overflow-hidden border-[3px] border-white shadow-sm mb-2 items-center justify-center bg-gray-200"
          style={{ elevation: 2 }}
        >
          {userImage ? (
            <Image
              source={{ uri: userImage }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full bg-blue-100 items-center justify-center">
              <Text className="text-3xl font-bold text-blue-600">
                {userName ? userName.charAt(0).toUpperCase() : "?"}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-xl font-extrabold text-gray-900 tracking-tight">
          {userName}
        </Text>
        <Text className="text-[13px] text-gray-500 font-medium mt-0.5 mb-2">
          +91 98765 43210
        </Text>
        <Pressable
          onPress={() => router.push("/(app)/(auth)/edit-profile")}
          className="bg-white border border-gray-200 px-3.5 py-1 rounded-full active:bg-gray-50"
        >
          <Text className="text-[10px] font-bold text-gray-600 tracking-wide">
            Edit Profile
          </Text>
        </Pressable>
      </View>

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Top Action Icons */}
        {/* <View className="px-2 pt-2 flex-row justify-end">
          <View className="flex-row items-center">
            <Pressable
              className="relative h-12 w-12 items-center justify-center"
              onPress={() => router.push("/(app)/(auth)/message-box")}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#111827"
                />
              </View>
              <View className="absolute top-1 right-1 h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white">
                <Text className="text-[10px] font-bold text-white mt-0.5">
                  4
                </Text>
              </View>
            </Pressable>
            <Pressable
              className="relative h-12 w-12 items-center justify-center"
              onPress={() => router.push("/(app)/(auth)/cart")}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Ionicons name="cart-outline" size={22} color="#111827" />
              </View>
              <View className="absolute top-1 right-1 h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white">
                <Text className="text-[10px] font-bold text-white mt-0.5">
                  5
                </Text>
              </View>
            </Pressable>
          </View>
        </View> */}

        {/* Gavero Coins Card */}
        <View className="px-4 mb-3">
          {/* Container with a deep, modern dark background */}
          <Pressable
            className="bg-[#111827] rounded-2xl p-2 flex-row items-center justify-between shadow-sm active:opacity-80"
            onPress={() => router.push("/(app)/(auth)/gavero-coins" as any)}
          >
            <View className="flex-row items-center gap-3">
              {/* Hexagonal or minimal icon container */}
              <View className="h-14 w-14 justify-center">
                <Image
                  source={require("@/src/assets/images/profile/GaveroJar.png")}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              </View>

              <View>
                <Text className="text-[12px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
                  Gavero Coins
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-3xl font-black text-white tracking-tight">
                    450
                  </Text>
                </View>
              </View>
            </View>

            {/* Chevron Icon */}
            <Ionicons name="chevron-forward" size={15} color="#9ca3af" />
          </Pressable>
        </View>

        {/* Saved & Favorites Row */}
        <View className="px-4 mb-8 flex-row gap-2">
          <Pressable
            className="flex-1 p-2 bg-white rounded-xl border active:opacity-70"
            style={{ borderWidth: 1, borderColor: "#d1d5db" }}
            onPress={() => router.push("/(app)/(auth)/my-favorites" as any)}
          >
            <View className="flex-row justify-between items-center gap-1">
              <View className="flex-row items-center gap-2 flex-1">
                <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center">
                  <Ionicons name="heart-outline" size={20} color="#1f2937" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[12px] font-medium text-gray-800"
                    numberOfLines={1}
                  >
                    Favorites
                  </Text>
                  <Text
                    className="text-[9px] font-normal text-gray-500"
                    numberOfLines={1}
                  >
                    Saved items
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#6b7280" />
            </View>
          </Pressable>

          <Pressable
            className="flex-1 p-2 bg-white rounded-xl border active:opacity-70"
            style={{ borderWidth: 1, borderColor: "#d1d5db" }}
            onPress={() => router.push("/(app)/(auth)/save-products" as any)}
          >
            <View className="flex-row justify-between items-center gap-1">
              <View className="flex-row items-center gap-2 flex-1">
                <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center">
                  <Ionicons name="bookmark-outline" size={20} color="#1f2937" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[12px] font-medium text-gray-800"
                    numberOfLines={1}
                  >
                    Products
                  </Text>
                  <Text
                    className="text-[9px] font-normal text-gray-500"
                    numberOfLines={1}
                  >
                    For later
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#6b7280" />
            </View>
          </Pressable>
        </View>

        {/* Preferences */}
        <View className="px-4 mb-4">
          <Text className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
            Preferences
          </Text>
          <View>
            <View className="mb-2">
              <Pressable
                className="p-2 bg-white rounded-xl border active:opacity-70"
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                }}
                onPress={() => dietarySheetRef.current?.present()}
              >
                <View className="flex-row justify-between items-center gap-2">
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center">
                      <Ionicons name="leaf-outline" size={20} color="#1f2937" />
                    </View>
                    <View>
                      <Text className="text-[14px] font-medium text-gray-800">
                        Dietary Preferences
                      </Text>
                      <Text className="text-[10px] font-normal text-gray-500">
                        Veg only restaurants and food
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={15} color="#6b7280" />
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <View className="px-4 mb-4">
          <Text className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
            My Account
          </Text>
          <View>
            {PROFILE_LINKS.map((link) => (
              <LinkItem key={link.id} item={link} />
            ))}
          </View>
        </View>

        {/* More Links */}
        <View className="px-4 mb-6">
          <Text className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
            More
          </Text>
          <View>
            {MORE_LINKS.map((link) => (
              <LinkItem key={link.id} item={link} />
            ))}
          </View>
        </View>

        {/* Log Out Button */}
        <View className="px-4 mb-10">
          <Pressable
            className="w-full bg-red-500 py-3.5 rounded-xl items-center justify-center flex-row gap-2 active:opacity-80"
            style={({ pressed }) => [
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
            onPress={handleLogout}
          >
            <Text className="text-[14px] font-bold text-white tracking-wide">
              Log Out
            </Text>
          </Pressable>
        </View>
      </Animated.ScrollView>

      {/* Dietary Preferences Bottom Sheet */}
      <BottomSheetModal
        ref={dietarySheetRef}
        index={0}
        snapPoints={dietarySnapPoints}
        backdropComponent={renderBackdrop}
        handleComponent={() => null}
        enablePanDownToClose={true}
        backgroundStyle={{ borderRadius: 0 }}
      >
        <BottomSheetView
          style={{ flex: 1, paddingBottom: insets.bottom + 20 }}
          className="p-5"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-lg font-bold text-gray-900">
              Dietary Preferences
            </Text>
            <Pressable
              onPress={() => dietarySheetRef.current?.dismiss()}
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 active:opacity-70"
            >
              <Ionicons name="close" size={20} color="#4B5563" />
            </Pressable>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between py-3 px-4 rounded-2xl bg-gray-50 border border-gray-100">
              <View className="flex-row items-center gap-4 flex-1 mr-2">
                <View className="h-10 w-10 rounded-full bg-orange-100 items-center justify-center">
                  <Ionicons name="restaurant" size={20} color="#EA580C" />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-semibold text-gray-800">
                    Pure Veg Restaurants
                  </Text>
                  <Text className="text-[11px] text-gray-500 mt-0.5">
                    Only show restaurants that serve 100% vegetarian food
                  </Text>
                </View>
              </View>
              <CustomSwitch
                value={isFullyVegRestaurant}
                onValueChange={setIsFullyVegRestaurant}
                activeColor="#F97316"
                inactiveColor="#E5E7EB"
              />
            </View>

            <View className="flex-row items-center justify-between py-3 px-4 rounded-2xl bg-gray-50 border border-gray-100">
              <View className="flex-row items-center gap-4 flex-1 mr-2">
                <View className="h-10 w-10 rounded-full bg-green-100 items-center justify-center">
                  <Ionicons name="leaf" size={20} color="#16A34A" />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-semibold text-gray-800">
                    Veg Food Everywhere
                  </Text>
                  <Text className="text-[11px] text-gray-500 mt-0.5">
                    Show only vegetarian items from any restaurant
                  </Text>
                </View>
              </View>
              <CustomSwitch
                value={isVegFoodAnyRestaurant}
                onValueChange={setIsVegFoodAnyRestaurant}
                activeColor="#16A34A"
                inactiveColor="#E5E7EB"
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </ScreenView>
  );
};

export default Profile;
