import "@/global.css";
import Header from "@/src/components/ui/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const SafeAreaView = styled(RNSafeAreaView);

// ─── Schema ───────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "Too long")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Too long")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

  email: z
    .string()
    .max(100, "Too long")
    .refine((val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email",
    }),
});

// infer type directly from schema — single source of truth
type ProfileForm = z.infer<typeof profileSchema>;

// ─── FieldInput ───────────────────────────────────────────────────────────────

interface FieldInputProps {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  onBlur: () => void;
  hasError?: boolean;
  errorMessage?: string;
  submitCount?: number;
  autoCapitalize?: "none" | "words" | "sentences" | "characters";
  keyboardType?: "default" | "email-address";
  icon?: React.ReactNode;
  maxLength?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FieldInput = ({
  placeholder,
  value,
  onChange,
  onBlur,
  hasError = false,
  errorMessage,
  submitCount = 0,
  autoCapitalize = "words",
  keyboardType = "default",
  icon,
  maxLength,
}: FieldInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  };

  useEffect(() => {
    if (hasError && submitCount > 0) {
      shake();
    }
  }, [submitCount]);

  const borderColor = hasError ? "#FCA5A5" : isFocused ? "#111827" : "#E5E7EB";

  return (
    <View className="gap-1">
      <AnimatedPressable
        onPress={() => inputRef.current?.focus()}
        style={[{ borderColor }, shakeStyle]}
        className="form-input-box"
      >
        {icon}
        <TextInput
          ref={inputRef}
          className="form-input-text"
          placeholder={placeholder}
          placeholderTextColor="#D1D5DB"
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
        />
      </AnimatedPressable>

      {/* Error lives inside FieldInput — component owns its full UI */}
      {hasError && errorMessage && (
        <Text className="text-[11px] text-red-400 ml-1">{errorMessage}</Text>
      )}
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CompleteProfile() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, submitCount },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange", // clears error as user fixes it
  });

  async function onSubmit(data: ProfileForm) {
    // isSubmitting = true automatically while this runs
    // await api.post("/profile", data);
    console.log(data);
    router.replace("/(app)/(tabs)/home");
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Header title="Complete your profile" border />

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
          <View className="flex-1 px-6 pt-6 gap-5">
            {/* ── First + Last name row ── */}
            <View className="flex-row gap-3">
              <View className="flex-1 gap-1.5">
                <Text className="form-input-label">First Name</Text>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <FieldInput
                      placeholder="Viraj"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      hasError={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      submitCount={submitCount}
                      maxLength={50}
                    />
                  )}
                />
              </View>

              <View className="flex-1 gap-1.5">
                <Text className="form-input-label">Last Name</Text>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <FieldInput
                      placeholder="Dayle"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      hasError={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      submitCount={submitCount}
                      maxLength={50}
                    />
                  )}
                />
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
              <Text className="form-input-label">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <FieldInput
                    placeholder="you@example.com"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hasError={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    submitCount={submitCount}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    maxLength={100}
                    icon={
                      <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                    }
                  />
                )}
              />
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
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="rounded-full py-2 flex-row items-center justify-center gap-2 active:opacity-70 bg-orange-500"
            >
              <Text className="text-lg text-white font-bold">
                {isSubmitting ? "Saving..." : "Continue"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
