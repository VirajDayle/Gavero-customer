import Header from "@/src/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SETTINGS_SECTIONS = [
  {
    title: "Account Settings",
    items: [
      { id: "password", icon: "lock-closed-outline", label: "Change Password", type: "link" },
      { id: "phone", icon: "call-outline", label: "Phone Number", type: "link", value: "+91 98765 43210" },
      { id: "linked", icon: "link-outline", label: "Linked Accounts", type: "link" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { id: "push", icon: "notifications-outline", label: "Push Notifications", type: "toggle", state: true },
      { id: "sms", icon: "chatbubble-outline", label: "SMS Alerts", type: "toggle", state: false },
      { id: "email", icon: "mail-outline", label: "Email Offers", type: "toggle", state: true },
    ],
  },
  {
    title: "App Settings",
    items: [
      { id: "language", icon: "language-outline", label: "Language", type: "link", value: "English" },
      { id: "region", icon: "globe-outline", label: "Region", type: "link", value: "India" },
      { id: "dark_mode", icon: "moon-outline", label: "Dark Mode", type: "toggle", state: false },
    ],
  },
  {
    title: "Data & Privacy",
    items: [
      { id: "data", icon: "download-outline", label: "Download My Data", type: "link" },
      { id: "delete", icon: "trash-outline", label: "Delete Account", type: "link", color: "#ef4444", iconBg: "#fef2f2" },
    ],
  },
];

const Settings = () => {
  const router = useRouter();
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    push: true,
    sms: false,
    email: true,
    dark_mode: false,
  });

  const handleToggle = (id: string) => {
    setToggleStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF7]">
      <Header title="Settings" back border />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6 gap-7">
          {SETTINGS_SECTIONS.map((section, idx) => (
            <View key={idx}>
              <Text className="text-[13px] font-bold text-gray-800 mb-3 ml-1">
                {section.title}
              </Text>

              <View 
                className="bg-white rounded-2xl border overflow-hidden"
                style={{ borderColor: "#e5e7eb" }}
              >
                {section.items.map((item, itemIdx) => {
                  const isLast = itemIdx === section.items.length - 1;
                  return (
                    <Pressable
                      key={item.id}
                      className={`flex-row items-center justify-between p-3.5 bg-white ${
                        !isLast ? "border-b border-gray-100" : ""
                      }`}
                      style={({ pressed }) => ({
                        backgroundColor: pressed && item.type === "link" ? "#f9fafb" : "#fff",
                      })}
                    >
                      <View className="flex-row items-center gap-3.5">
                        <View 
                          className="h-10 w-10 rounded-xl items-center justify-center"
                          style={{ backgroundColor: item.iconBg || "#f3f4f6" }}
                        >
                          <Ionicons
                            name={item.icon as any}
                            size={20}
                            color={item.color || "#1f2937"}
                          />
                        </View>
                        <Text
                          className="text-[15px] font-medium"
                          style={{ color: item.color || "#1f2937" }}
                        >
                          {item.label}
                        </Text>
                      </View>

                      {item.type === "link" ? (
                        <View className="flex-row items-center gap-2">
                          {item.value && (
                            <Text className="text-[13px] font-medium text-gray-500">
                              {item.value}
                            </Text>
                          )}
                          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                        </View>
                      ) : (
                        <Switch
                          value={toggleStates[item.id]}
                          onValueChange={() => handleToggle(item.id)}
                          trackColor={{ false: "#e5e7eb", true: "#111827" }}
                          thumbColor="#fff"
                          ios_backgroundColor="#e5e7eb"
                          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View className="items-center pb-12 pt-2">
          <Text className="text-[12px] text-gray-400 font-medium tracking-wide">Gavero Settings v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
