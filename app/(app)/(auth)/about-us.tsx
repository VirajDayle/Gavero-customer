import Header from "@/src/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const STATS = [
  { id: 1, label: "ACTIVE USERS", value: "10M+" },
  { id: 2, label: "CITIES", value: "500+" },
  { id: 3, label: "PARTNERS", value: "50K+" },
];

const VALUES = [
  {
    id: 1,
    icon: "rocket-outline",
    title: "Relentless Innovation",
    desc: "We continuously push boundaries to deliver magical experiences.",
  },
  {
    id: 2,
    icon: "heart-outline",
    title: "Customer First",
    desc: "Every decision we make starts and ends with our users.",
  },
  {
    id: 3,
    icon: "leaf-outline",
    title: "Sustainable Future",
    desc: "Building a delivery ecosystem that respects our planet.",
  },
];

const LINKS = [
  {
    id: "terms",
    label: "Terms of Service",
    route: {
      pathname: "/(app)/(public)/term-sheet",
      params: { type: "termsAndServices" },
    },
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    route: {
      pathname: "/(app)/(public)/term-sheet",
      params: { type: "privacyPolicy" },
    },
  },
];

const AboutUs = () => {
  const router = useRouter();

  const handleLinkPress = (link: any) => {
    if (link.route) {
      router.push(link.route as any);
    } else if (link.url) {
      Linking.openURL(link.url).catch(() => {});
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F4F6]">
      <Header title="About Gavero" back />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Hero Section */}
        <View className="pt-10 pb-10 items-center justify-center">
          <View className="h-24 w-24 bg-slate-900 rounded-[28px] items-center justify-center mb-6 shadow-sm shadow-slate-300">
            <Ionicons name="infinite" size={54} color="#ffffff" />
          </View>
          <Text className="text-5xl font-black text-slate-900 tracking-tighter mb-3">
            GAVERO
          </Text>
          <Text className="text-[15px] font-medium text-slate-500 text-center leading-6 px-12">
            Gavero is an all-inclusive and sophisticated ecosystem.
          </Text>
        </View>

        {/* Message from Founder */}
        <View className="px-5 mb-6">
          <LinearGradient
            colors={["#1E1B4B", "#111827"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 rounded-[28px] shadow-sm relative overflow-hidden"
          >
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              MESSAGE FROM THE FOUNDER
            </Text>
            <Text className="text-[15px] font-medium text-slate-200 leading-6 italic mb-5">
              "A small startup to make local shopkeepers provide starting,
              trends and e-commerce utility."
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 bg-white/10 rounded-full items-center justify-center border border-white/20">
                <Ionicons name="person" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-sm font-bold text-white">Founder</Text>
                <Text className="text-[11px] text-slate-400 font-medium">
                  Gavero Technologies
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Mission Section */}
        <View className="px-5 mb-6">
          <LinearGradient
            colors={["#E0F2FE", "#F0F9FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 rounded-[28px] border border-sky-100 items-center relative overflow-hidden"
          >
            <Text className="text-[11px] font-bold text-sky-700 uppercase tracking-widest mb-3">
              OUR MISSION
            </Text>
            <Text className="text-base font-semibold text-sky-900 text-center leading-6 px-2">
              To make local shopkeepers online to help connectional content and
              culture.
            </Text>
          </LinearGradient>
        </View>

        {/* Stats Section */}
        <View className="px-5 mb-6">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
            STATS
          </Text>
          <View className="flex-row justify-between gap-3">
            {STATS.map((stat) => (
              <View
                key={stat.id}
                className="flex-1 py-5 px-2 bg-[#EBECEF] rounded-[22px] items-center justify-center"
              >
                <Text className="text-xl font-black text-slate-900 tracking-tight mb-1">
                  {stat.value}
                </Text>
                <Text className="text-[9px] font-bold text-slate-500 tracking-wider text-center">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Core Values */}
        <View className="px-5 mb-6">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
            CORE VALUES
          </Text>
          <View className="bg-white rounded-[24px] p-2 border border-slate-100 shadow-sm">
            {VALUES.map((value, index) => (
              <View
                key={value.id}
                className={`p-4 flex-row items-center gap-4 ${
                  index !== VALUES.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <View className="h-11 w-11 bg-slate-900 rounded-xl items-center justify-center">
                  <Ionicons
                    name={value.icon as any}
                    size={20}
                    color="#FFFFFF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-900 mb-0.5">
                    {value.title}
                  </Text>
                  <Text
                    className="text-xs text-slate-400 leading-4"
                    numberOfLines={1}
                  >
                    {value.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Links & Footer */}
        <View className="px-5 mb-4">
          <View className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden mb-8">
            {LINKS.map((link, index) => (
              <Pressable
                key={link.id}
                onPress={() => handleLinkPress(link)}
                className={`p-4 flex-row items-center justify-between active:bg-slate-50 ${
                  index !== LINKS.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <Text className="text-sm font-medium text-slate-800">
                  {link.label}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </Pressable>
            ))}
          </View>

          <View className="items-center justify-center">
            <View className="mb-2">
              <Ionicons name="infinite" size={24} color="#64748B" />
            </View>
            <Text className="text-[10px] font-bold text-slate-400 tracking-[0.15em] mb-1">
              GAVERO TECHNOLOGIES INC.
            </Text>
            <Text className="text-[11px] font-medium text-slate-400">
              Version 2.4.0 (Build 842)
            </Text>
            <Text className="text-[11px] font-medium text-slate-400 mt-0.5">
              Made with ♥ in India
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;
