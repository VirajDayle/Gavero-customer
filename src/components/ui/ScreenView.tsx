import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * ScreenView — drop-in replacement for SafeAreaView.
 *
 * WHY: SafeAreaView triggers a native measure pass on mount that takes 1 frame,
 * causing content to render at top=0 then jump to the correct position.
 *
 * FIX: useSafeAreaInsets() reads from React context synchronously — the value
 * is available on the very first render frame (no native measure cycle),
 * so content is always positioned correctly from frame 1.
 *
 * Usage: <ScreenView style={{ backgroundColor: '#fff' }}>...</ScreenView>
 *        <ScreenView edges={['top']} style={...}>  ← only apply top padding
 */

type Edge = "top" | "bottom" | "left" | "right";

interface ScreenViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Which safe area edges to apply. Defaults to all four. */
  edges?: Edge[];
}

const ScreenView: React.FC<ScreenViewProps> = ({
  children,
  style,
  edges = ["top", "bottom", "left", "right"],
}) => {
  const insets = useSafeAreaInsets();

  const paddingStyle: ViewStyle = {
    paddingTop: edges.includes("top") ? insets.top : 0,
    paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
    paddingLeft: edges.includes("left") ? insets.left : 0,
    paddingRight: edges.includes("right") ? insets.right : 0,
  };

  return (
    <View style={[styles.container, paddingStyle, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenView;
