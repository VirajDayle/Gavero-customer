import "@/global.css";
import Header from "@/src/components/ui/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { styled } from "nativewind";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
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
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email",
    }),

  phone: z.string().min(10, "Phone number is required"),
  dob: z.string().optional(),
  gender: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

// ─── FieldInput ───────────────────────────────────────────────────────────────

interface FieldInputProps {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
  errorMessage?: string;
  submitCount?: number;
  autoCapitalize?: "none" | "words" | "sentences" | "characters";
  keyboardType?: "default" | "email-address" | "phone-pad";
  icon?: React.ReactNode;
  maxLength?: number;
  editable?: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
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
  editable = true,
  onPress,
  rightElement,
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
        onPress={() => {
          if (onPress) {
            onPress();
          } else if (editable) {
            inputRef.current?.focus();
          }
        }}
        style={[
          { borderColor },
          shakeStyle,
          !editable && !onPress && { backgroundColor: "#F3F4F6" },
        ]}
        className="form-input-box"
      >
        {icon}
        <View className="flex-1">
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
            editable={editable}
            pointerEvents={onPress ? "none" : "auto"}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              if (onBlur) onBlur();
            }}
          />
        </View>
        {rightElement}
      </AnimatedPressable>

      {hasError && errorMessage && (
        <Text className="text-[11px] text-red-400 ml-1">{errorMessage}</Text>
      )}
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EditProfile() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, submitCount },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "9876543210",
      dob: "12/05/1995",
      gender: "Male",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [isPhoneEditable, setIsPhoneEditable] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);



  // Refs for bottom sheets
  const genderSheetRef = useRef<BottomSheetModal>(null);

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const formattedDate = `${selectedDate.getDate().toString().padStart(2, "0")}/${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}/${selectedDate.getFullYear()}`;
      setValue("dob", formattedDate, { shouldValidate: true });
    }
  };

  const handleGenderSelect = (gender: string) => {
    setValue("gender", gender, { shouldValidate: true });
    genderSheetRef.current?.dismiss();
  };



  async function onSubmit(data: ProfileForm) {
    console.log("Updated Profile:", data);
    Alert.alert("Success", "Profile updated successfully!");
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF7]">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Header title="Edit Profile" back border />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 pt-6 gap-5">
            {/* ── Profile Image Placeholder ── */}
            <View className="items-center mb-2">
              <View className="relative h-24 w-24 rounded-full bg-blue-100 border-4 border-white shadow-sm items-center justify-center">
                <Text className="text-4xl font-bold text-blue-600">J</Text>
                <Pressable className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full items-center justify-center border-2 border-white">
                  <Ionicons name="camera" size={14} color="white" />
                </Pressable>
              </View>
            </View>

            {/* ── First + Last name row ── */}
            <View className="flex-row gap-3">
              <View className="flex-1 gap-1.5">
                <Text className="form-input-label">First Name</Text>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <FieldInput
                      placeholder="John"
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
                      placeholder="Doe"
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

            {/* ── Phone Number ── */}
            <View className="gap-1.5">
              <Text className="form-input-label">Phone Number</Text>
              <Controller
                control={control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FieldInput
                    placeholder="9876543210"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hasError={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    submitCount={submitCount}
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={isPhoneEditable}
                    onPress={
                      !isPhoneEditable
                        ? () => {
                            router.push("/(app)/(public)/otp");
                          }
                        : undefined
                    }
                    icon={
                      <Text className="text-gray-500 font-bold mr-1">+91</Text>
                    }
                    rightElement={
                      !isPhoneEditable ? (
                        <View className="px-3 py-1 bg-gray-200 rounded-md">
                          <Text className="text-[12px] font-bold text-gray-700">
                            Change
                          </Text>
                        </View>
                      ) : null
                    }
                  />
                )}
              />
            </View>

            {/* ── Email ── */}
            <View className="gap-1.5">
              <Text className="form-input-label">
                Email{" "}
                <Text className="text-gray-400 font-normal">(Optional)</Text>
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <FieldInput
                    placeholder="you@example.com"
                    value={field.value ?? ""}
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

            {/* ── DOB & Gender Row ── */}
            <View className="flex-row gap-3">
              <View className="flex-1 gap-1.5">
                <Text className="form-input-label">
                  Date of Birth{" "}
                  <Text className="text-gray-400 font-normal">(Opt)</Text>
                </Text>
                <Controller
                  control={control}
                  name="dob"
                  render={({ field }) => (
                    <FieldInput
                      placeholder="DD/MM/YYYY"
                      value={field.value ?? ""}
                      onChange={() => {}}
                      onPress={() => setShowDatePicker(true)}
                      icon={
                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color="#9CA3AF"
                        />
                      }
                    />
                  )}
                />
              </View>

              <View className="flex-1 gap-1.5">
                <Text className="form-input-label">
                  Gender{" "}
                  <Text className="text-gray-400 font-normal">(Opt)</Text>
                </Text>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <FieldInput
                      placeholder="Select"
                      value={field.value ?? ""}
                      onChange={() => {}}
                      onPress={() => {
                        Keyboard.dismiss();
                        genderSheetRef.current?.present();
                      }}
                      icon={
                        <Ionicons
                          name="person-outline"
                          size={18}
                          color="#9CA3AF"
                        />
                      }
                      rightElement={
                        <Ionicons
                          name="chevron-down"
                          size={16}
                          color="#9CA3AF"
                        />
                      }
                    />
                  )}
                />
              </View>
            </View>

            {/* ── CTA ── */}
            <View className="mt-4">
              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="rounded-2xl py-3.5 flex-row items-center justify-center gap-2 active:opacity-80 bg-blue-600 shadow-sm shadow-blue-200"
              >
                <Text className="text-[16px] text-white font-bold tracking-wide">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(1995, 4, 12)}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Gender Selection Bottom Sheet */}
      <BottomSheetModal
        ref={genderSheetRef}
        snapPoints={["35%"]}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
        backgroundStyle={{ borderRadius: 24 }}
      >
        <View className="p-5 flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Select Gender
          </Text>
          {["Male", "Female", "Other", "Prefer not to say"].map((gender) => (
            <Pressable
              key={gender}
              onPress={() => handleGenderSelect(gender)}
              className="py-3.5 border-b border-gray-100 flex-row items-center justify-between active:bg-gray-50"
            >
              <Text
                className={`text-[15px] ${watch("gender") === gender ? "font-bold text-blue-600" : "font-medium text-gray-700"}`}
              >
                {gender}
              </Text>
              {watch("gender") === gender && (
                <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
              )}
            </Pressable>
          ))}
        </View>
      </BottomSheetModal>


    </SafeAreaView>
  );
}
