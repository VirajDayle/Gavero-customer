import "@/global.css";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

function useShake() {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const trigger = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -4,
        duration: 40,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 40,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { shakeAnim, trigger };
}

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focusedIdx, setFocusedIdx] = useState<number>(0);
  const [isError, setIsError] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { shakeAnim, trigger: triggerShake } = useShake();

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (secondsLeft === 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  useEffect(() => {
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const isComplete = otp.every((d) => d !== "");

  // ✅ Auto-verify the moment all 6 digits are filled
  useEffect(() => {
    if (isComplete) handleVerify();
  }, [isComplete]);

  const clearError = () => setIsError(false);

  const handleChange = (text: string, idx: number) => {
    clearError();
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      const next = Array(OTP_LENGTH).fill("");
      digits.forEach((d, i) => (next[i] = d));
      setOtp(next);
      const jumpTo = Math.min(digits.length, OTP_LENGTH - 1);
      inputRefs.current[jumpTo]?.focus();
      setFocusedIdx(jumpTo);
      return;
    }
    const digit = text.replace(/\D/g, "");
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
      setFocusedIdx(idx + 1);
    }
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === "Backspace") {
      clearError();
      if (otp[idx]) {
        const next = [...otp];
        next[idx] = "";
        setOtp(next);
      } else if (idx > 0) {
        const next = [...otp];
        next[idx - 1] = "";
        setOtp(next);
        inputRefs.current[idx - 1]?.focus();
        setFocusedIdx(idx - 1);
      }
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    setCanResend(false);
    clearError();
    inputRefs.current[0]?.focus();
    setFocusedIdx(0);
    // TODO: trigger resend OTP API call
  };

  const handleVerify = async () => {
    Keyboard.dismiss();
    const enteredOtp = otp.join("");

    const isCorrect = enteredOtp === "1234";

    if (!isCorrect) {
      setIsError(true);
      triggerShake();
      setTimeout(() => {
        setOtp(Array(OTP_LENGTH).fill(""));
        setIsError(false); // ← clear error here, same moment as OTP reset
        inputRefs.current[0]?.focus();
        setFocusedIdx(0);
      }, 320);
      return; // ← remove the second setTimeout entirely
    }

    router.replace("/(app)/(auth)/completeProfile");
  };

  const maskedPhone = phone
    ? `+91 ${phone.slice(0, 2)}${"*".repeat(6)}${phone.slice(-2)}`
    : "+91 **********";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 32,
            gap: 24,
          }}
        >
          {/* Header */}
          <View style={{ gap: 4 }}>
            <Text className="text-xl font-semibold text-gray-800">
              Verify your number
            </Text>
            <Text style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 18 }}>
              Enter the 4-digit OTP sent to{" "}
              <Text style={{ color: "#374151", fontWeight: "500" }}>
                {maskedPhone}
              </Text>
            </Text>
          </View>

          {/* OTP boxes */}
          <View style={{ gap: 8 }}>
            <Animated.View
              style={{
                flexDirection: "row",
                gap: 7,
                justifyContent: "center",
                transform: [{ translateX: shakeAnim }],
              }}
            >
              {Array.from({ length: OTP_LENGTH }, (_, i) => {
                const isFocused = focusedIdx === i;
                const isFilled = otp[i] !== "";
                const borderColor = isError
                  ? "#EF4444"
                  : isFocused
                    ? "#F97316"
                    : isFilled
                      ? "#D1D5DB"
                      : "#E5E7EB";
                const bgColor = isError
                  ? "#FEF2F2"
                  : isFocused
                    ? "#FFF7ED"
                    : "#F9FAFB";

                return (
                  <TextInput
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    value={otp[i]}
                    onChangeText={(text) => handleChange(text, i)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, i)
                    }
                    onFocus={() => setFocusedIdx(i)}
                    keyboardType="number-pad"
                    maxLength={OTP_LENGTH}
                    selectTextOnFocus
                    style={{
                      width: 40,
                      height: 45,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor,
                      backgroundColor: bgColor,
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: "500",
                      color: isError ? "#EF4444" : "#111827",
                    }}
                  />
                );
              })}
            </Animated.View>

            {/* Resend */}
            <View style={{ alignItems: "center" }}>
              {canResend ? (
                <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#F97316",
                      fontWeight: "600",
                    }}
                  >
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ fontSize: 13, color: "#9CA3AF" }}>
                  Resend in{" "}
                  <Text style={{ color: "#374151", fontWeight: "500" }}>
                    {secondsLeft}s
                  </Text>
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
