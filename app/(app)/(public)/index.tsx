import "@/global.css";
import CandyRow from "@/src/components/ui/CandyRow";
import LEDBoard from "@/src/components/ui/LEDBoard";
import { ROW_SLICES } from "@/src/constants/candyData";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Index() {
  const [phone, setPhone] = useState("");
  const isValid = phone.length === 10;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View
          style={{
            height: 290,
            overflow: "hidden",
            gap: 5,
            paddingVertical: 8,
            position: "relative",
          }}
        >
          {ROW_SLICES.map((slice, i) => (
            <CandyRow
              key={i}
              icons={slice}
              direction={i % 2 === 0 ? "ltr" : "rtl"}
              duration={100_000} // your original slow speed
            />
          ))}
          <LinearGradient
            colors={["rgba(255,255,255,0)", "#FFFFFF"]}
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 50,
            }}
          />

          <LEDBoard
            lines={["We deliver everything", "you love."]}
            className="top-46"
          />
        </View>
        <View className="bg-green-300 opacity-85 flex justify-center items-center py-3 flex-row gap-2">
          <Ionicons name="color-wand-outline" className="text-sm" />
          <Text className="text-xs">
            Login or Sign Up to get everything from market to your home!
          </Text>
        </View>

        {/* Skip button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            position: "absolute",
            top: 8,
            right: 20,
            backgroundColor: "rgba(255,255,255,0.85)",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            zIndex: 30,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "500", color: "#6B7280" }}>
            Skip
          </Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={false}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 36,
              gap: 20,
            }}
          >
            <View
              style={{ gap: 6 }}
              className="flex items-center justify-center"
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#374151",
                  letterSpacing: 0.1,
                }}
              >
                Enter your mobile number
              </Text>
              <Text style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 18 }}>
                We'll send a one-time password to verify
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F9FAFB",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 16,
                paddingHorizontal: 16,
                height: 45,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#374151",
                  paddingRight: 12,
                }}
              >
                +91
              </Text>
              <View
                style={{
                  width: 1,
                  height: 22,
                  backgroundColor: "#E5E7EB",
                  marginRight: 12,
                }}
              />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#111827",
                  letterSpacing: 0.5,
                }}
                placeholder="9876543210"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={setPhone}
                value={phone}
              />
              {phone.length > 0 && (
                <Text style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 8 }}>
                  {phone.length}/10
                </Text>
              )}
            </View>

            <Link href={"/(app)/(public)/otp"} asChild>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={!isValid}
                style={{
                  backgroundColor: isValid ? "#F97316" : "#D1D5DB",
                  borderRadius: 28,
                  paddingVertical: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Text className="text-lg text-white font-bold">Continue</Text>
              </TouchableOpacity>
            </Link>

            <Text
              style={{
                fontSize: 11,
                textAlign: "center",
                color: "#9CA3AF",
                lineHeight: 17,
                paddingHorizontal: 12,
              }}
            >
              By continuing, you agree to our{" "}
              <Link
                href={{
                  pathname: "/(app)/(public)/TermSheet",
                  params: { type: "termsAndServices" },
                }}
              >
                <Text style={{ color: "#F97316", fontWeight: "500" }}>
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
                <Text style={{ color: "#F97316", fontWeight: "500" }}>
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
