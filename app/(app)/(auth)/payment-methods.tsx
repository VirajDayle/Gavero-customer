import Header from "@/src/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { styled } from "nativewind";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import {
  SafeAreaView as RNSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const INITIAL_CARDS = [
  {
    id: "1",
    brand: "VISA",
    last4: "4242",
    expiry: "12/25",
    name: "Viraj Dayle",
    isPrimary: true,
    color: "bg-stone-900",
  },
  {
    id: "2",
    brand: "MasterCard",
    last4: "8899",
    expiry: "08/28",
    name: "Viraj Dayle",
    isPrimary: false,
    color: "bg-slate-800",
  },
];

const INITIAL_UPI = [
  {
    id: "1",
    vpa: "viraj.dayle@okicici",
    appName: "Google Pay",
    isPrimary: false,
  },
];

const PaymentMethods = () => {
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [upis, setUpis] = useState(INITIAL_UPI);

  // Bottom Sheet Refs
  const addCardSheetRef = useRef<BottomSheetModal>(null);
  const addUpiSheetRef = useRef<BottomSheetModal>(null);

  const snapPointsCard = useMemo(() => ["65%"], []);
  const snapPointsUpi = useMemo(() => ["45%"], []);

  // Form State - Card
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Form State - UPI
  const [upiId, setUpiId] = useState("");

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
      />
    ),
    [],
  );

  const handleAddCard = () => {
    if (!cardNumber || !expiry || !cardName) return;
    const newCard = {
      id: Date.now().toString(),
      brand: cardNumber.startsWith("4") ? "VISA" : "MasterCard",
      last4: cardNumber.slice(-4) || "0000",
      expiry,
      name: cardName,
      isPrimary: cards.length === 0,
      color: "bg-indigo-900", // New cards get a dark indigo look
    };
    setCards([...cards, newCard]);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCardName("");
    addCardSheetRef.current?.dismiss();
  };

  const handleAddUpi = () => {
    if (!upiId) return;
    const newUpi = {
      id: Date.now().toString(),
      vpa: upiId,
      appName: "Other UPI App",
      isPrimary: upis.length === 0,
    };
    setUpis([...upis, newUpi]);
    setUpiId("");
    addUpiSheetRef.current?.dismiss();
  };

  const setPrimaryCard = (id: string) => {
    setCards(cards.map((c) => ({ ...c, isPrimary: c.id === id })));
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const deleteUpi = (id: string) => {
    setUpis(upis.filter((u) => u.id !== id));
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#FAFAF7]">
        <Header title="Payment Methods" back border />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-xl font-black text-gray-900 tracking-tight mb-4 mt-2">
            Saved Cards
          </Text>
          <Pressable
            className="p-2 mb-2 bg-white rounded-xl border active:opacity-70"
            style={{ borderWidth: 1, borderColor: "#d1d5db" }}
            onPress={() => addCardSheetRef.current?.present()}
          >
            <View className="flex-row justify-between items-center gap-2">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center">
                  <Ionicons name="card-outline" size={20} color="#1f2937" />
                </View>
                <View>
                  <Text className="text-[14px] font-medium text-gray-800">
                    Add New Card
                  </Text>
                  <Text className="text-[10px] font-normal text-gray-500">
                    Credit or debit card
                  </Text>
                </View>
              </View>
              <Ionicons name="add-outline" size={15} color="#6b7280" />
            </View>
          </Pressable>

          {cards.map((card) => (
            <View
              key={card.id}
              className={`${card.color} rounded-3xl p-4 px-5 mb-2 shadow-sm relative overflow-hidden`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {/* Decorative background elements */}
              <View className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/5" />
              <View className="absolute -left-10 -bottom-10 w-24 h-24 rounded-full bg-white/5" />

              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Card Number
                  </Text>
                  <Text className="text-white text-[16px] font-bold tracking-[4px]">
                    **** **** **** {card.last4}
                  </Text>
                </View>
                <Text className="text-white font-black text-[18px] italic tracking-wider">
                  {card.brand}
                </Text>
              </View>

              <View className="flex-row justify-between items-end">
                <View>
                  <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Card Holder
                  </Text>
                  <Text className="text-white text-[14px] font-bold tracking-wide">
                    {card.name}
                  </Text>
                </View>
                <View>
                  <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1 text-right">
                    Expires
                  </Text>
                  <Text className="text-white text-[14px] font-bold tracking-wide text-right">
                    {card.expiry}
                  </Text>
                </View>
              </View>

              {/* Action buttons (Delete / Set Primary) */}
              <View className="mt-4 pt-3 border-t border-white/10 flex-row justify-between items-center">
                <Pressable
                  onPress={() => setPrimaryCard(card.id)}
                  className="flex-row items-center gap-2 active:opacity-70"
                >
                  <View
                    className={`w-4 h-4 rounded-full border items-center justify-center ${
                      card.isPrimary
                        ? "border-green-400 bg-transparent"
                        : "border-white/40"
                    }`}
                  >
                    {card.isPrimary && (
                      <View className="w-2 h-2 rounded-full bg-green-400" />
                    )}
                  </View>
                  <Text
                    className={
                      card.isPrimary
                        ? "text-green-400 text-xs font-bold"
                        : "text-white/70 text-xs font-semibold"
                    }
                  >
                    {card.isPrimary ? "Primary Method" : "Set as Primary"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => deleteCard(card.id)}
                  className="p-1 active:opacity-60 bg-white/10 rounded-full h-8 w-8 items-center justify-center"
                >
                  <Ionicons name="trash-outline" size={14} color="#fca5a5" />
                </Pressable>
              </View>
            </View>
          ))}

          {cards.length === 0 && (
            <View className="items-center py-4">
              <Text className="text-gray-400">No saved cards.</Text>
            </View>
          )}

          <Text className="text-xl font-black text-gray-900 tracking-tight mt-6 mb-4">
            Saved UPI IDs
          </Text>
          <Pressable
            className="p-2 mb-2 bg-white rounded-xl border active:opacity-70"
            style={{ borderWidth: 1, borderColor: "#d1d5db" }}
            onPress={() => addUpiSheetRef.current?.present()}
          >
            <View className="flex-row justify-between items-center gap-2">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center">
                  <Ionicons name="at-outline" size={20} color="#1f2937" />
                </View>
                <View>
                  <Text className="text-[14px] font-medium text-gray-800">
                    Add New UPI ID
                  </Text>
                  <Text className="text-[10px] font-normal text-gray-500">
                    Google Pay, PhonePe, Paytm
                  </Text>
                </View>
              </View>
              <Ionicons name="add-outline" size={15} color="#6b7280" />
            </View>
          </Pressable>

          {upis.map((upi) => (
            <View
              key={upi.id}
              className="bg-white rounded-2xl p-4 mb-2 shadow-sm border border-gray-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 bg-indigo-50 rounded-xl items-center justify-center border border-indigo-100">
                  <Ionicons name="at-outline" size={24} color="#4f46e5" />
                </View>
                <View>
                  <Text className="text-[15px] font-bold text-gray-900 mb-0.5">
                    {upi.vpa}
                  </Text>
                  <Text className="text-[12px] font-medium text-gray-500">
                    {upi.appName}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => deleteUpi(upi.id)}
                className="p-2 active:opacity-60 bg-red-50 rounded-full h-9 w-9 items-center justify-center"
              >
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </Pressable>
            </View>
          ))}
          {upis.length === 0 && (
            <View className="items-center py-4">
              <Text className="text-gray-400">No saved UPI IDs.</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Add Card Bottom Sheet */}
      <BottomSheetModal
        ref={addCardSheetRef}
        index={0}
        snapPoints={snapPointsCard}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
        backgroundStyle={{ backgroundColor: "#FFFFFF", borderRadius: 24 }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            padding: 24,
            paddingBottom: insets.bottom + 24,
          }}
        >
          <View className="flex-row items-center justify-between mb-8 mt-2">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center">
                <Ionicons name="card" size={24} color="#15803d" />
              </View>
              <View>
                <Text className="text-xl font-black text-gray-900 tracking-tight">
                  Add New Card
                </Text>
                <Text className="text-[12px] font-medium text-gray-500">
                  Credit or Debit Card
                </Text>
              </View>
            </View>
            <Pressable className="bg-gray-100 p-2.5 rounded-full active:opacity-70">
              <Ionicons name="scan-outline" size={22} color="#4b5563" />
            </Pressable>
          </View>

          <View className="mb-5">
            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Card Number
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Ionicons name="card-outline" size={20} color="#9ca3af" />
              <TextInput
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="0000 0000 0000 0000"
                keyboardType="numeric"
                maxLength={19}
                className="flex-1 text-[16px] font-semibold text-gray-900 ml-3"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View className="flex-row gap-4 mb-5">
            <View className="flex-1">
              <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                Expiry Date
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
                <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
                <TextInput
                  value={expiry}
                  onChangeText={setExpiry}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="flex-1 text-[16px] font-semibold text-gray-900 ml-3"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                CVV
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9ca3af"
                />
                <TextInput
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  className="flex-1 text-[16px] font-semibold text-gray-900 ml-3"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Cardholder Name
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Ionicons name="person-outline" size={20} color="#9ca3af" />
              <TextInput
                value={cardName}
                onChangeText={setCardName}
                placeholder="John Doe"
                autoCapitalize="words"
                className="flex-1 text-[16px] font-semibold text-gray-900 ml-3"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <Pressable
            onPress={handleAddCard}
            className="w-full bg-green-800 h-14 rounded-full flex-row items-center justify-center gap-2 active:opacity-80 shadow-sm"
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text className="text-white text-[16px] font-bold tracking-wide">
              Securely Save Card
            </Text>
          </Pressable>

          <View className="flex-row items-center justify-center mt-5 gap-1.5 pb-4">
            <Ionicons name="shield-checkmark" size={14} color="#6b7280" />
            <Text className="text-[11px] font-medium text-gray-500">
              Your card details are fully encrypted.
            </Text>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* Add UPI Bottom Sheet */}
      <BottomSheetModal
        ref={addUpiSheetRef}
        index={0}
        snapPoints={snapPointsUpi}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
        backgroundStyle={{ backgroundColor: "#FFFFFF", borderRadius: 24 }}
      >
        <BottomSheetView
          style={{ flex: 1, padding: 24, paddingBottom: insets.bottom + 24 }}
        >
          <View className="flex-row items-center gap-3 mb-8 mt-2">
            <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center">
              <Ionicons name="at" size={24} color="#4f46e5" />
            </View>
            <View>
              <Text className="text-xl font-black text-gray-900 tracking-tight">
                Add UPI ID
              </Text>
              <Text className="text-[12px] font-medium text-gray-500">
                Google Pay, PhonePe, Paytm, etc.
              </Text>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Virtual Payment Address
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Ionicons name="wallet-outline" size={20} color="#9ca3af" />
              <TextInput
                value={upiId}
                onChangeText={setUpiId}
                placeholder="e.g. viraj@okicici"
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 text-[16px] font-semibold text-gray-900 ml-3"
                placeholderTextColor="#9ca3af"
              />
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={upiId.includes("@") ? "#10b981" : "#e5e7eb"}
              />
            </View>
            <View className="flex-row items-center mt-4 gap-1.5 ml-1">
              <Ionicons name="shield-checkmark" size={14} color="#6b7280" />
              <Text className="text-[11px] font-medium text-gray-500">
                We will verify this ID with your bank.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleAddUpi}
            className="w-full bg-indigo-600 h-14 rounded-full flex-row items-center justify-center gap-2 active:opacity-80 shadow-sm mt-auto mb-6"
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text className="text-white text-[16px] font-bold tracking-wide">
              Verify & Save UPI
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default PaymentMethods;
