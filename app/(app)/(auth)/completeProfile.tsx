import "@/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
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

export default function CompleteProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;
  const emailIsValid =
    email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailHasError = !emailIsValid && email.length > 0;

  function handleSubmit() {
    if (!isValid || !emailIsValid) return;
    router.replace("/(app)/(tabs)/home");
  }

  // ── Reusable input border color (matches index.tsx logic) ──
  function borderColor(field: string, hasError = false) {
    if (hasError) return "#FCA5A5";
    if (focusedField === field) return "#111827";
    return "#E5E7EB";
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* ── Header ── */}
        <View className="flex-row items-center justify-center px-5 pt-2 pb-3 border-b border-gray-100">
          <Text className="text-[17px] font-extrabold text-gray-800">
            Complete your profile
          </Text>
        </View>

        {/* ── Skip ── */}
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
            {/* ── First + Last name row ── */}
            <View className="flex-row gap-3">
              {/* First name */}
              <View className="flex-1 gap-1.5">
                <Text className="form-input-label">First Name</Text>
                <Pressable
                  onPress={() => firstNameRef.current?.focus()}
                  style={{ borderColor: borderColor("firstName") }}
                  className="form-input-box"
                >
                  <TextInput
                    ref={firstNameRef}
                    className="form-input-text"
                    placeholder="Viraj"
                    placeholderTextColor="#D1D5DB"
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={100}
                    value={firstName}
                    onChangeText={setFirstName}
                    onFocus={() => setFocusedField("firstName")}
                    onBlur={() => setFocusedField(null)}
                  />
                </Pressable>
              </View>

              {/* Last name */}
              <View className="flex-1 gap-1.5">
                <Text className="form-input-label">Last Name</Text>
                <Pressable
                  onPress={() => lastNameRef.current?.focus()}
                  style={{ borderColor: borderColor("lastName") }}
                  className="form-input-box"
                >
                  <TextInput
                    ref={lastNameRef}
                    className="form-input-text"
                    placeholder="Dayle"
                    placeholderTextColor="#D1D5DB"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={lastName}
                    onChangeText={setLastName}
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField(null)}
                  />
                </Pressable>
              </View>
            </View>

            {/* ── Optional divider ── */}
            <View className="flex-row items-center gap-2.5">
              <View className="flex-1 h-px bg-gray-100" />
              <Text className="text-[10px] text-gray-300 tracking-[0.5px]">
                OPTIONAL
              </Text>
              <View className="flex-1 h-px bg-gray-100" />
            </View>

            {/* ── Email ── */}
            <View className="gap-1.5">
              <View className="flex-row items-center gap-1.5">
                <Text className="form-input-label">Email</Text>
                {/* <View className="bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                  <Text className="text-[10px] text-gray-400">optional</Text>
                </View> */}
              </View>

              <Pressable
                onPress={() => emailRef.current?.focus()}
                style={{ borderColor: borderColor("email", emailHasError) }}
                className="form-input-box gap-1"
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="#9CA3AF"
                  className="pl-1"
                />
                <TextInput
                  ref={emailRef}
                  className="form-input-text"
                  placeholder="you@example.com"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </Pressable>

              {emailHasError && (
                <Text className="text-[11px] text-red-500 mt-0.5">
                  Please enter a valid email address
                </Text>
              )}
            </View>

            {/* ── Hint box ── */}
            <View className="bg-green-50 border border-green-200 rounded-xl p-3 flex-row gap-1">
              <Ionicons
                name="bulb-outline"
                size={15}
                color="#16A34A"
                style={{ marginTop: 1 }}
              />
              <Text className="text-[12px] text-green-700 leading-4.25 flex-1">
                Adding your email lets us send order receipts and exclusive
                offers to your inbox.
              </Text>
            </View>

            {/* ── CTA ── */}
            <Pressable
              disabled={!isValid || !emailIsValid}
              onPress={handleSubmit}
              className={`rounded-full py-2 flex-row items-center justify-center gap-2 active:opacity-70 ${
                isValid && emailIsValid ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <Text className="text-lg text-white font-bold">Submit</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
