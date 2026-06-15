import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PRIVACY_POLICY, TERMS_AND_SERVICES } from "@/src/constants/terms";

export type SheetType = "termsAndServices" | "privacyPolicy";

export default function TermsSheet() {
  const { type } = useLocalSearchParams<{ type: SheetType }>();

  const sections =
    type === "termsAndServices" ? TERMS_AND_SERVICES : PRIVACY_POLICY;

  const title =
    type === "termsAndServices" ? "Terms of Service" : "Privacy Policy";

  const handleClose = useCallback(() => {
    router.dismiss();
  }, []);

  return (
    <>
      {Platform.OS === "android" && (
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      )}

      {/*
       * SafeAreaView is the ROOT — no wrapping View with flex:1 around it.
       * flex:1 here fills the entire screen/sheet detent height.
       */}
      <SafeAreaView style={styles.root}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pb-3 pt-3 bg-white border-b border-gray-100">
          <View className="flex-1">
            <Text className="text-[18px] font-extrabold text-gray-900 tracking-tight">
              {title}
            </Text>
            <Text className="text-[11px] text-gray-400 mt-0.5">
              Last updated: May 11, 2026
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="h-8 w-8 bg-gray-100 items-center justify-center rounded-full ml-3"
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/*
         * ScrollView is a DIRECT child of SafeAreaView.
         * This is the critical rule for iOS formSheet scroll to work.
         * Any intermediate View with flex:1 breaks gesture handoff.
         *
         * style={{ flex: 1 }} — fills remaining height after header.
         * bounces on iOS keeps UIScrollView in a state the sheet
         * gesture recognizer cooperates with.
         */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={Platform.OS === "ios"}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {/* Intro banner */}
          <View style={styles.banner}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#F97316"
              style={styles.bannerIcon}
            />
            <Text style={styles.bannerText}>
              Welcome to Gavero. By using our Services you agree to the
              following terms. Please read them carefully — they govern your
              rights and responsibilities on the platform.
            </Text>
          </View>

          {/* Sections */}
          {sections.map((item, idx) => (
            <View key={idx} style={styles.section}>
              <Text style={styles.sectionHeading}>{item.heading}</Text>
              <Text style={styles.sectionBody}>{item.body}</Text>
              {idx < sections.length - 1 && <View style={styles.divider} />}
            </View>
          ))}

          {/* Footer */}
          <Text style={styles.footer}>
            © 2026 Gavero. All rights reserved.{"\n"}
            support@gavero.com · www.gavero.com
          </Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 20,
  },

  banner: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 10,
  },

  bannerIcon: {
    marginTop: 1,
  },

  bannerText: {
    fontSize: 12,
    color: "#92400E",
    lineHeight: 18,
    flex: 1,
  },

  section: {
    gap: 6,
  },

  sectionHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.1,
  },

  sectionBody: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 19,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#F3F4F6",
    marginTop: 6,
  },

  footer: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 16,
    marginTop: 4,
  },
});
