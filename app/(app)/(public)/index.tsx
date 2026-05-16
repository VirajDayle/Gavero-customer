import "@/global.css";
import CandyRow from "@/src/components/ui/CandyRow";
import LEDBoard from "@/src/components/ui/LEDBoard";
import { ROW_SLICES } from "@/src/constants/candyData";
import clsx from "clsx";
import { Link, router } from "expo-router";
import { styled } from "nativewind";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Index() {
  const [phone, setPhone] = useState("");
  const isValid = phone.length === 10;

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ── refs so Pressable wrapper can forward tap to input ───
  const phoneNumberRef = useRef<TextInput>(null);

  function borderColor(field: string, hasError = false) {
    if (hasError) return "#FCA5A5";
    if (focusedField === field) return "#111827"; // dark when focused
    return "#E5E7EB";
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View className="h-77.5 overflow-hidden gap-1.25 py-2 relative">
          {ROW_SLICES.map((slice, i) => (
            <CandyRow
              key={i}
              icons={slice}
              direction={i % 2 === 0 ? "ltr" : "rtl"}
              duration={100_000} // your original slow speed
            />
          ))}
          {/* <LinearGradient
            colors={["rgba(255,255,255,0)", "#FFFFFF"]}
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 50,
            }}
          /> */}

          <LEDBoard
            lines={["We deliver everything", "you love."]}
            className="top-46"
          />
        </View>
        <View className="bg-green-200 opacity-85 flex justify-center items-center py-3.5 flex-row gap-1">
          <Text className="text-sm">
            Login or Sign up to get everything delivered to your home
          </Text>
        </View>

        {/* Skip button */}
        <Pressable
          onPress={() => router.replace("/(app)/(tabs)/home")}
          className="absolute top-2 right-5 bg-white/85 px-3 py-1 rounded-full border border-gray-200 z-30 active:opacity-85"
        >
          <Text className="text-base font-medium text-gray-500">Skip</Text>
        </Pressable>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={false}
        >
          <View className="flex-1 px-6 pt-6 pb-9 gap-5">
            <View className="items-center gap-1.5">
              <Text className="text-xl font-medium text-gray-700 tracking-tight">
                Enter your mobile number
              </Text>
              <Text className="text-sm text-gray-500 leading-5 text-center">
                We'll send a one-time password to verify
              </Text>
            </View>
            <Pressable
              onPress={() => phoneNumberRef.current?.focus()}
              style={{ borderColor: borderColor("firstName") }}
              className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 "
            >
              <Text className="text-[17px] font-semibold text-gray-900 pr-3">
                +91
              </Text>
              <View className="w-px h-5.5 bg-gray-300 mr-3" />
              <TextInput
                className="flex-1 text-[17px] font-semibold text-gray-900 tracking-[0.5px]"
                placeholder="9876543210"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={setPhone}
                value={phone}
                onFocus={() => setFocusedField("firstName")}
                onBlur={() => setFocusedField(null)}
              />
              {phone.length > 0 && (
                <Text className="text-sm text-gray-400 ml-2">
                  {phone.length}/10
                </Text>
              )}
            </Pressable>

            <Pressable
              disabled={!isValid}
              onPress={() =>
                router.push({
                  pathname: "/(app)/(public)/otp",
                  params: { phone: phone },
                })
              }
              className={clsx(
                `rounded-full py-2 flex-row items-center justify-center gap-2`,
                isValid ? "bg-orange-500" : "bg-gray-300",
                "active:opacity-70",
              )}
            >
              <Text className="text-lg text-white font-bold">Continue</Text>
            </Pressable>

            <Text className="text-[11px] text-center text-gray-400 leading-4.5 px-2">
              By continuing, you agree to our{" "}
              <Link
                href={{
                  pathname: "/(app)/(public)/TermSheet",
                  params: { type: "termsAndServices" },
                }}
              >
                <Text className="text-orange-500 font-medium ">
                  Terms of Service
                </Text>{" "}
              </Link>
              and{" "}
              <Link
                href={{
                  pathname: "/(app)/(public)/TermSheet",
                  params: { type: "privacyPolicy" },
                }}
              >
                <Text className="text-orange-500 font-medium">
                  Privacy Policy
                </Text>
                {""}
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
