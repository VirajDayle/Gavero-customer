import "@/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styled } from "nativewind";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function CompleteProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // ── focus state ──────────────────────────────────────────
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ── refs so Pressable wrapper can forward tap to input ───
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;
  const emailIsValid =
    email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function handleSubmit() {
    if (!isValid || !emailIsValid) return;
  }

  // returns border color for a given field name
  function borderColor(field: string, hasError = false) {
    if (hasError) return "#FCA5A5";
    if (focusedField === field) return "#111827"; // dark when focused
    return "#E5E7EB";
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 12,
            gap: 12,
            borderBottomWidth: 0.5,
            borderBottomColor: "#F3F4F6",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#1F2937" }}>
            Complete your profile
          </Text>
        </View>

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

        <View
          style={{
            paddingHorizontal: 24,
            paddingBottom: 36,
            gap: 14,
            marginTop: 20,
          }}
        >
          {/* First + Last name row */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* First name */}
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={labelStyle}>First name</Text>
              {/* ↓ Pressable fills the whole box and forwards focus */}
              <Pressable
                onPress={() => firstNameRef.current?.focus()}
                style={[inputWrap, { borderColor: borderColor("firstName") }]}
              >
                <TextInput
                  ref={firstNameRef}
                  style={[inputStyle, { flex: 1 }]}
                  placeholder="Viraj"
                  placeholderTextColor="#D1D5DB"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={firstName}
                  onChangeText={setFirstName}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField(null)}
                />
              </Pressable>
            </View>

            {/* Last name */}
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={labelStyle}>Last name</Text>
              <Pressable
                onPress={() => lastNameRef.current?.focus()}
                style={[inputWrap, { borderColor: borderColor("lastName") }]}
              >
                <TextInput
                  ref={lastNameRef}
                  style={[inputStyle, { flex: 1 }]}
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

          {/* Optional divider */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{ flex: 1, height: 0.5, backgroundColor: "#F3F4F6" }}
            />
            <Text
              style={{ fontSize: 10, color: "#D1D5DB", letterSpacing: 0.5 }}
            >
              OPTIONAL
            </Text>
            <View
              style={{ flex: 1, height: 0.5, backgroundColor: "#F3F4F6" }}
            />
          </View>

          {/* Email */}
          <View style={{ gap: 6 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={labelStyle}>Email address</Text>
              <View
                style={{
                  backgroundColor: "#F9FAFB",
                  borderWidth: 0.5,
                  borderColor: "#E5E7EB",
                  borderRadius: 4,
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                }}
              >
                <Text style={{ fontSize: 10, color: "#9CA3AF" }}>optional</Text>
              </View>
            </View>

            <Pressable
              onPress={() => emailRef.current?.focus()}
              style={[
                inputWrap,
                {
                  borderColor: borderColor(
                    "email",
                    !emailIsValid && email.length > 0,
                  ),
                },
              ]}
            >
              <Ionicons name="mail-outline" size={16} color="#9CA3AF" />
              <TextInput
                ref={emailRef}
                style={[inputStyle, { flex: 1, marginLeft: 8 }]}
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

            {!emailIsValid && email.length > 0 && (
              <Text style={{ fontSize: 11, color: "#EF4444", marginTop: 2 }}>
                Please enter a valid email address
              </Text>
            )}
          </View>

          {/* Hint */}
          <View
            style={{
              backgroundColor: "#F0FDF4",
              borderWidth: 0.5,
              borderColor: "#BBF7D0",
              borderRadius: 10,
              padding: 12,
              flexDirection: "row",
              gap: 8,
            }}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={15}
              color="#16A34A"
              style={{ marginTop: 1 }}
            />
            <Text
              style={{
                fontSize: 11,
                color: "#15803D",
                lineHeight: 17,
                flex: 1,
              }}
            >
              Adding your email lets us send order receipts and exclusive offers
              to your inbox.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isValid || !emailIsValid}
            onPress={handleSubmit}
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
            <Text className="text-lg text-white font-bold">Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const labelStyle = {
  fontSize: 15,
  fontWeight: "600" as const,
  color: "#374151",
  letterSpacing: 0.1,
};

const inputWrap = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  backgroundColor: "#F9FAFB",
  borderWidth: 1,
  borderRadius: 14,
  paddingHorizontal: 14,
  height: 40,
};

const inputStyle = {
  fontSize: 14,
  color: "#111827",
  letterSpacing: 0.3,
};
