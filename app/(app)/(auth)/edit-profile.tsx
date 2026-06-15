import "@/global.css";
import Header from "@/src/components/ui/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { styled } from "nativewind";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView as RNSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { z } from "zod";

const SafeAreaView = styled(RNSafeAreaView);

const itemHeight = 44;

const CustomWheelPicker = ({
  data,
  selectedValue,
  onValueChange,
}: {
  data: number[];
  selectedValue: number;
  onValueChange: (val: number) => void;
}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const index = data.findIndex((d) => d === selectedValue);
    if (index !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index, animated: false });
      }, 100);
    }
  }, [data, selectedValue]);

  return (
    <View
      className="flex-1 items-center relative"
      style={{ height: itemHeight * 3 }}
    >
      <View
        className="absolute w-full bg-orange-50 rounded-xl"
        style={{ top: itemHeight * 1, height: itemHeight, zIndex: 0 }}
        pointerEvents="none"
      />
      <FlatList
        ref={flatListRef}
        className="w-full"
        data={data}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        contentContainerStyle={{ paddingVertical: itemHeight * 1 }}
        onMomentumScrollEnd={(ev) => {
          const index = Math.round(ev.nativeEvent.contentOffset.y / itemHeight);
          if (data[index] && data[index] !== selectedValue) {
            onValueChange(data[index]);
          }
        }}
        renderItem={({ item }) => (
          <View
            style={{ height: itemHeight, zIndex: 1 }}
            className="items-center justify-center w-full"
          >
            <Text
              className={`text-[16px] ${
                item === selectedValue
                  ? "font-bold text-orange-600 text-[18px]"
                  : "font-medium text-gray-400"
              }`}
            >
              {item.toString().padStart(2, "0")}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

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
      <Animated.View style={shakeStyle}>
        <Pressable
          onPress={() => {
            console.log("👉 FieldInput Pressable clicked!");
            if (onPress) {
              onPress();
            } else if (editable) {
              inputRef.current?.focus();
            }
          }}
          style={[
            { borderColor },
            !editable && !onPress && { backgroundColor: "#F3F4F6" },
          ]}
          className="form-input-box"
        >
          {icon}
          <View pointerEvents={onPress ? "none" : "auto"} className="flex-1">
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
              editable={!onPress && editable}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                if (onBlur) onBlur();
              }}
            />
          </View>
          {rightElement}
        </Pressable>
      </Animated.View>

      {hasError && errorMessage && (
        <Text className="text-[11px] text-red-400 ml-1">{errorMessage}</Text>
      )}
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EditProfile() {
  const insets = useSafeAreaInsets();
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

  // Refs for bottom sheets
  const genderSheetRef = useRef<BottomSheetModal>(null);
  const dobSheetRef = useRef<BottomSheetModal>(null);
  const imageSheetRef = useRef<BottomSheetModal>(null);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      imageSheetRef.current?.dismiss();
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      imageSheetRef.current?.dismiss();
    }
  };

  const dobValue = watch("dob");
  const parsedDob = useMemo(() => {
    if (dobValue) {
      const parts = dobValue.split("/");
      if (parts.length === 3) {
        return new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0]),
        );
      }
    }
    return new Date(1995, 4, 12);
  }, [dobValue]);

  const [selectedDay, setSelectedDay] = useState(parsedDob.getDate());
  const [selectedMonth, setSelectedMonth] = useState(parsedDob.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(parsedDob.getFullYear());

  useEffect(() => {
    setSelectedDay(parsedDob.getDate());
    setSelectedMonth(parsedDob.getMonth() + 1);
    setSelectedYear(parsedDob.getFullYear());
  }, [parsedDob]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleSaveDob = () => {
    const formattedDate = `${selectedDay.toString().padStart(2, "0")}/${selectedMonth.toString().padStart(2, "0")}/${selectedYear}`;
    setValue("dob", formattedDate, { shouldValidate: true });
    dobSheetRef.current?.dismiss();
  };

  const dobSnapPoints = useMemo(() => ["50%"], []);

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

  const handleGenderSelect = (gender: string) => {
    setValue("gender", gender, { shouldValidate: true });
    genderSheetRef.current?.dismiss();
  };

  async function onSubmit(data: ProfileForm) {
    console.log("Updated Profile:", data);
    Alert.alert("Success", "Profile updated successfully!");
    router.back();
  }

  const genderSnapPoints = useMemo(() => ["40%"], []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Header title="Edit Profile" back border />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-6 gap-5">
            {/* ── Profile Image Placeholder ── */}
            <View className="items-center mb-2">
              <View className="relative h-24 w-24 rounded-full bg-blue-100 border-4 border-white shadow-sm items-center justify-center">
                {profileImage ? (
                  <Image source={{ uri: profileImage }} className="h-full w-full rounded-full" />
                ) : (
                  <Text className="text-4xl font-bold text-blue-600">J</Text>
                )}
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setTimeout(() => imageSheetRef.current?.present(), 100);
                  }}
                  className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full items-center justify-center border-2 border-white active:opacity-70"
                >
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
                <Text className="form-input-label">Date of Birth</Text>
                <Controller
                  control={control}
                  name="dob"
                  render={({ field }) => (
                    <FieldInput
                      placeholder="DD/MM/YYYY"
                      value={field.value ?? ""}
                      onChange={() => {}}
                      onPress={() => {
                        Keyboard.dismiss();
                        setTimeout(() => {
                          dobSheetRef.current?.present();
                        }, 100);
                      }}
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
                <Text className="form-input-label">Gender</Text>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <FieldInput
                      placeholder="Select"
                      value={field.value ?? ""}
                      onChange={() => {}}
                      onPress={() => {
                        console.log(
                          "👉 Gender field clicked! Trying to open bottom sheet...",
                        );
                        Keyboard.dismiss();
                        setTimeout(() => {
                          genderSheetRef.current?.present();
                        }, 100);
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
                className="rounded-full py-2 flex-row items-center justify-center gap-2 active:opacity-70 bg-orange-500"
              >
                <Text className="text-lg text-white font-bold">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* DOB Selection Bottom Sheet */}
      <BottomSheetModal
        ref={dobSheetRef}
        index={0}
        snapPoints={dobSnapPoints}
        backdropComponent={renderBackdrop}
        handleComponent={() => null}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        backgroundStyle={{ borderRadius: 0 }}
      >
        <BottomSheetView
          style={{ flex: 1, paddingBottom: insets.bottom + 20 }}
          className="p-5 justify-between"
        >
          <View>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-bold text-gray-900">
                Select Date of Birth
              </Text>
              <Pressable
                onPress={() => dobSheetRef.current?.dismiss()}
                className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 active:opacity-70"
              >
                <Ionicons name="close" size={20} color="#4B5563" />
              </Pressable>
            </View>

            <View className="flex-row items-center justify-center px-2 gap-2">
              <CustomWheelPicker
                data={days}
                selectedValue={selectedDay}
                onValueChange={setSelectedDay}
              />
              <CustomWheelPicker
                data={months}
                selectedValue={selectedMonth}
                onValueChange={setSelectedMonth}
              />
              <CustomWheelPicker
                data={years}
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
              />
            </View>
          </View>

          <Pressable
            onPress={handleSaveDob}
            className="rounded-full py-3.5 flex-row items-center justify-center bg-orange-500 mt-4 active:opacity-80"
          >
            <Text className="text-[16px] text-white font-bold tracking-wide">
              Confirm
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Gender Selection Bottom Sheet */}
      <BottomSheetModal
        ref={genderSheetRef}
        index={0}
        snapPoints={genderSnapPoints}
        backdropComponent={renderBackdrop}
        handleComponent={() => null}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        backgroundStyle={{ borderRadius: 0 }}
      >
        <BottomSheetView
          style={{ flex: 1, paddingBottom: insets.bottom + 20 }}
          className="p-5 justify-between"
        >
          <View>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-bold text-gray-900">
                Select Gender
              </Text>
              <Pressable
                onPress={() => genderSheetRef.current?.dismiss()}
                className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 active:opacity-70"
              >
                <Ionicons name="close" size={20} color="#4B5563" />
              </Pressable>
            </View>

            <View className="flex-row items-center gap-3 justify-between px-5">
              {["Male", "Female", "Other"].map((gender) => {
                const isSelected = watch("gender") === gender;
                return (
                  <Pressable
                    key={gender}
                    onPress={() => handleGenderSelect(gender)}
                    className={`flex-1 py-3.5 rounded-2xl border flex-row items-center justify-center gap-1.5 active:opacity-70 ${
                      isSelected
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Text
                      className={`text-[14px] ${isSelected ? "font-bold text-orange-600" : "font-medium text-gray-700"}`}
                    >
                      {gender}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Profile Image Selection Bottom Sheet */}
      <BottomSheetModal
        ref={imageSheetRef}
        index={0}
        snapPoints={useMemo(() => ["45%"], [])}
        backdropComponent={renderBackdrop}
        handleComponent={() => null}
        enablePanDownToClose={true}
        backgroundStyle={{ borderRadius: 0 }}
      >
        <BottomSheetView style={{ flex: 1, paddingBottom: insets.bottom + 20 }} className="p-5">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-lg font-bold text-gray-900">
              Profile Photo
            </Text>
            <Pressable
              onPress={() => imageSheetRef.current?.dismiss()}
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 active:opacity-70"
            >
              <Ionicons name="close" size={20} color="#4B5563" />
            </Pressable>
          </View>

          <View className="gap-3">
            <Pressable
              onPress={takePhoto}
              className="flex-row items-center gap-4 py-3 px-4 rounded-2xl bg-gray-50 border border-gray-100 active:opacity-70"
            >
              <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center">
                <Ionicons name="camera" size={20} color="#2563EB" />
              </View>
              <Text className="text-[16px] font-semibold text-gray-800">
                Take Photo
              </Text>
            </Pressable>

            <Pressable
              onPress={pickImage}
              className="flex-row items-center gap-4 py-3 px-4 rounded-2xl bg-gray-50 border border-gray-100 active:opacity-70"
            >
              <View className="h-10 w-10 rounded-full bg-orange-100 items-center justify-center">
                <Ionicons name="image" size={20} color="#EA580C" />
              </View>
              <Text className="text-[16px] font-semibold text-gray-800">
                Choose from Gallery
              </Text>
            </Pressable>
            
            {profileImage && (
              <Pressable
                onPress={() => {
                  setProfileImage(null);
                  imageSheetRef.current?.dismiss();
                }}
                className="flex-row items-center gap-4 py-3 px-4 rounded-2xl bg-gray-50 border border-gray-100 active:opacity-70"
              >
                <View className="h-10 w-10 rounded-full bg-red-100 items-center justify-center">
                  <Ionicons name="trash" size={20} color="#DC2626" />
                </View>
                <Text className="text-[16px] font-semibold text-red-600">
                  Remove Photo
                </Text>
              </Pressable>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
