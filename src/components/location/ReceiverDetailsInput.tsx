import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import * as Contacts from "expo-contacts";
import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface ReceiverDetailsInputProps {
  name: string;
  phone: string;
  onChangeName: (name: string) => void;
  onChangePhone: (phone: string) => void;
  onBlurName?: () => void;
  onBlurPhone?: () => void;
  hasNameError?: boolean;
  hasPhoneError?: boolean;
  phoneErrorMessage?: string;
  submitCount?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ReceiverDetailsInput: React.FC<ReceiverDetailsInputProps> = ({
  name,
  phone,
  onChangeName,
  onChangePhone,
  onBlurName,
  onBlurPhone,
  hasNameError = false,
  hasPhoneError = false,
  phoneErrorMessage,
  submitCount = 0,
}) => {
  const [hasReceiverDetailOpen, setHasReceiverDetailOpen] =
    useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<
    "receiverName" | "receiverPhone" | null
  >(null);

  const receiverNameRef = useRef<TextInput>(null);
  const receiverPhoneRef = useRef<TextInput>(null);

  const shakeXName = useSharedValue(0);
  const shakeXPhone = useSharedValue(0);

  const shakeStyleName = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeXName.value }],
  }));

  const shakeStylePhone = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeXPhone.value }],
  }));

  function shakeName() {
    shakeXName.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }

  function shakePhone() {
    shakeXPhone.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }

  useEffect(() => {
    if (submitCount > 0) {
      if (hasNameError) shakeName();
      if (hasPhoneError) shakePhone();
    }
  }, [submitCount]);

  const handleSelectContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const contact = await Contacts.presentContactPickerAsync();
      if (contact) {
        onChangeName(contact.name || "");
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          const num =
            contact.phoneNumbers[0].digits ||
            contact.phoneNumbers[0].number ||
            "";
          onChangePhone(num.replace(/\\D/g, "").slice(-10));
        }
        setHasReceiverDetailOpen(true);
      }
    }
  };

  const handleBlurName = () => {
    setFocusedField(null);
    onBlurName?.();
  };

  const handleBlurPhone = () => {
    setFocusedField(null);
    onBlurPhone?.();
  };

  return (
    <View className="gap-1.5">
      <Text className="form-input-label">Receiver Details</Text>
      <View
        className={clsx(
          "gap-2 border px-2.5 py-4 rounded-xl",
          hasReceiverDetailOpen
            ? "bg-gray-50 border-gray-200"
            : "bg-blue-50 border-blue-100",
        )}
      >
        <View className="flex-row gap-2">
          {hasReceiverDetailOpen ? (
            <>
              <AnimatedPressable
                key="receiver-name"
                onPress={() => receiverNameRef.current?.focus()}
                style={[
                  {
                    borderColor: hasNameError
                      ? "red"
                      : focusedField === "receiverName"
                        ? "#111827"
                        : "#E5E7EB",
                  },
                  shakeStyleName,
                ]}
                className="flex-row items-center border rounded-xl px-1 h-11 flex-1"
              >
                <Text className="absolute left-3 px-1.5 bg-gray-50 -top-2.5 text-[12px] text-gray-700 font-medium">
                  Name
                </Text>

                <TextInput
                  ref={receiverNameRef}
                  style={{
                    textAlignVertical: "center",
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                  className="flex-1 text-[15px] font-normal text-gray-900 h-full"
                  placeholderTextColor="#D1D5DB"
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={100}
                  value={name}
                  onChangeText={onChangeName}
                  onFocus={() => setFocusedField("receiverName")}
                  onBlur={handleBlurName}
                />
              </AnimatedPressable>
              <AnimatedPressable
                key="receiver-phone"
                onPress={() => receiverPhoneRef.current?.focus()}
                style={[
                  {
                    borderColor: hasPhoneError
                      ? "red"
                      : focusedField === "receiverPhone"
                        ? "#111827"
                        : "#E5E7EB",
                  },
                  shakeStylePhone,
                ]}
                className="flex-row items-center border rounded-xl px-1 h-11 flex-1"
              >
                <Text className="absolute left-3 px-1.5 bg-gray-50 -top-2.5 text-[12px] text-gray-700 font-medium">
                  Phone
                </Text>
                <TextInput
                  ref={receiverPhoneRef}
                  style={{
                    textAlignVertical: "center",
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                  className="flex-1 text-[15px] font-normal text-gray-900 h-full"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="phone-pad"
                  autoCorrect={false}
                  maxLength={10}
                  value={phone}
                  onChangeText={onChangePhone}
                  onFocus={() => setFocusedField("receiverPhone")}
                  onBlur={handleBlurPhone}
                />
              </AnimatedPressable>
            </>
          ) : (
            <>
              <Pressable
                key="contact-picker"
                className="justify-center items-center bg-white border border-blue-200 rounded-xl p-1.5 active:opacity-60 shadow-sm"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 1,
                  elevation: 1,
                }}
                onPress={handleSelectContact}
              >
                <Image
                  source={require("@/src/assets/images/contacts/contactbook.png")}
                  className="size-6"
                  resizeMode="contain"
                />
              </Pressable>
              <View
                key="contact-details"
                className="bg-transparent justify-center flex-1"
              >
                <View className="flex-row gap-2 items-center">
                  <Text className="text-[14px] font-semibold">Viraj Dayle</Text>
                  <View className="bg-black rounded-full size-1"></View>
                  <Text className="text-[14px] font-semibold">9826571506</Text>
                </View>
              </View>
              <Pressable
                key="edit-button"
                onPress={() => setHasReceiverDetailOpen(true)}
                className="justify-center px-2"
              >
                <Text className="text-gray-400 font-medium">Edit</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {hasPhoneError && phoneErrorMessage && (
        <Text className="text-[10px] text-red-500 px-1 -mt-1">
          <Ionicons name="alert-outline" size={12} color="#FCA5A5" />
          {phoneErrorMessage}
        </Text>
      )}
      {hasNameError && !hasPhoneError && (
        <Text className="text-[10px] text-red-500 px-1 -mt-1">
          <Ionicons name="alert-outline" size={12} color="#FCA5A5" />
          Required
        </Text>
      )}
    </View>
  );
};

export default ReceiverDetailsInput;
