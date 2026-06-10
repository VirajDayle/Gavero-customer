import Header from "@/src/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { styled } from "nativewind";
import React, { useCallback, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView as RNSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// Dummy Data matching previous screens
const ORDER_CATEGORIES = [
  {
    title: "Grocery & Essentials",
    icon: require("@/src/assets/images/shopCategeory/groceryActive.png"),
    items: [
      {
        name: "Tata Tea Premium | Desh Ki Chai | Unique Blend Crafted For Chai Lovers Across India | Black Tea | 1.5kg",
        image: "https://m.media-amazon.com/images/I/41wospnFmoL.AC_SX250.jpg",
        price: 507,
        quantity: 1,
      },
      {
        name: "NESCAFE Classic Instant Coffee Powder | Great start to your morning | 100% Pure Coffee | 200g Pouch",
        image:
          "https://m.media-amazon.com/images/I/41b6lQgmXlL._SY300_SX300_QL70_FMwebp_.jpg",
        price: 320,
        quantity: 2,
      },
    ],
  },
  {
    title: "Food & Restaurant",
    icon: require("@/src/assets/images/shopCategeory/restaurant.png"),
    items: [
      {
        name: "Veg Hakka Noodles - Full",
        image:
          "https://shwetainthekitchen.com/wp-content/uploads/2023/03/vegetable-noodles.jpg",
        price: 180,
        quantity: 1,
      },
      {
        name: "Paneer Chilli Dry",
        image:
          "https://images.unsplash.com/photo-1551881192-002d027b65f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        price: 220,
        quantity: 1,
      },
    ],
  },
];

const OrderSummary = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [activeCategory, setActiveCategory] = useState(
    ORDER_CATEGORIES[0].title,
  );

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const generateInvoiceHtml = () => {
    let itemsHtml = "";

    ORDER_CATEGORIES.forEach((category) => {
      itemsHtml += `
        <tr class="category-row">
          <td colspan="4"><strong>${category.title}</strong></td>
        </tr>
      `;
      category.items.forEach((item) => {
        itemsHtml += `
          <tr>
            <td>${item.name}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">₹${item.price}</td>
            <td style="text-align: right;">₹${item.price * item.quantity}</td>
          </tr>
        `;
      });
    });

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ea580c; padding-bottom: 15px; }
            .header h1 { margin: 0; color: #ea580c; font-size: 28px; }
            .header p { margin: 5px 0 0; color: #666; font-size: 14px; }
            .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
            .info-block { width: 48%; }
            .info-block p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { padding: 12px 10px; border-bottom: 1px solid #eee; text-align: left; }
            th { background-color: #f9fafb; font-weight: bold; color: #4b5563; }
            .category-row td { background-color: #fff7ed; color: #ea580c; font-size: 14px; padding-top: 15px; }
            .totals { width: 50%; float: right; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .totals-row.grand { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
            .footer { clear: both; text-align: center; margin-top: 50px; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Balaji Mart</h1>
            <p>Tax Invoice / Bill of Supply</p>
          </div>
          
          <div class="info-section">
            <div class="info-block">
              <strong>Order Details:</strong>
              <p>Order ID: #123456789</p>
              <p>Date: 08 Jun 2026, 10:30 AM</p>
              <p>Payment Mode: UPI - Paid</p>
            </div>
            <div class="info-block">
              <strong>Billed To:</strong>
              <p>Customer Name</p>
              <p>89 Tilak Marg Barwaha, Near City Center</p>
              <p>Madhya Pradesh, 451115</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Item Total:</span>
              <span>₹1,867</span>
            </div>
            <div class="totals-row">
              <span>Delivery Fee:</span>
              <span>₹40</span>
            </div>
            <div class="totals-row">
              <span>Platform Fee:</span>
              <span>₹5</span>
            </div>
            <div class="totals-row" style="color: #16a34a;">
              <span>Coupon Discount:</span>
              <span>-₹50</span>
            </div>
            <div class="totals-row grand">
              <span>Grand Total:</span>
              <span>₹1,862</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>This is a computer generated invoice and does not require a physical signature.</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleViewPdf = async () => {
    bottomSheetModalRef.current?.dismiss();
    try {
      const html = generateInvoiceHtml();
      await Print.printAsync({ html });
    } catch (error) {
      console.error("Error viewing PDF:", error);
    }
  };

  const handleDownloadPdf = async () => {
    bottomSheetModalRef.current?.dismiss();
    try {
      const html = generateInvoiceHtml();
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Download / Share Invoice",
          UTI: "com.adobe.pdf",
        });
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF7]">
      <Header title="Order Summary" back border />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#C2410C", "#FDBA74", "#F3F4F6"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            flex: 1,
            height: 250,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: -1,
          }}
        />

        {/* Order Info Card */}
        <View className="mx-3 border border-gray-100 mt-4 rounded-2xl p-4 bg-white gap-2">
          <View className="flex-row justify-between items-center border-b border-gray-100 pb-2">
            <Text className="text-[13px] font-bold text-gray-800">
              Order ID: #123456789
            </Text>
            <View className="bg-green-100 px-2 py-0.5 rounded text-center items-center justify-center">
              <Text className="text-[10px] font-bold text-green-700 tracking-wide uppercase">
                Delivered
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center pt-1">
            <View>
              <Text className="text-[11px] text-gray-500 uppercase tracking-wider mb-0.5">
                Order Date
              </Text>
              <Text className="text-[13px] font-medium text-gray-800">
                08 Jun 2026, 10:30 AM
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[11px] text-gray-500 uppercase tracking-wider mb-0.5">
                Method
              </Text>
              <Text className="text-[13px] font-medium text-gray-800">
                Home Delivery
              </Text>
            </View>
          </View>
        </View>

        {/* Shop Card & Items */}
        <View className="mt-2 rounded-2xl bg-white mx-3 border border-gray-100 overflow-hidden">
          <View className="flex-row items-center gap-3.5 px-4 pt-2 pb-1">
            <View className="mt-0.5 h-14 w-14 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
              <Image
                source={require("@/src/assets/images/balajimart.png")}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <View>
              <Text
                className="text-[16.5px] font-semibold text-gray-900"
                numberOfLines={1}
              >
                Balaji Mart
              </Text>
            </View>
          </View>

          {/* Category Chips */}
          <View className="flex-row mx-3 mt-4 mb-2 gap-3 justify-start">
            {ORDER_CATEGORIES.map((category, index) => {
              const isActive = activeCategory === category.title;
              const isRestaurant = category.title === "Food & Restaurant";

              let activeBg = "bg-[#B7ECCD]";
              if (isRestaurant) {
                activeBg = "bg-black";
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => setActiveCategory(category.title)}
                  className={`h-17 w-17 p-2 border rounded-xl items-center justify-center ${
                    isActive
                      ? "border-gray-400 " + activeBg
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <Image
                    source={category.icon}
                    className="h-10 w-10"
                    resizeMode="contain"
                  />
                </Pressable>
              );
            })}
          </View>

          {/* Active Category Items */}
          <View className="mx-3 mt-4 pb-3 mb-2 gap-1.5">
            {ORDER_CATEGORIES.find((c) => c.title === activeCategory)?.items.map((item, index) => (
              <View key={index}>
                <View className="flex-row justify-between items-start py-2">
                  {/* Left Section: Image and Name */}
                  <View className="flex-row items-start gap-3 flex-1">
                    <View className="h-15 w-15 rounded-md overflow-hidden border border-gray-100 bg-white">
                      <Image
                        source={{ uri: item.image }}
                        className="h-full w-full"
                        resizeMode="contain"
                      />
                    </View>
                    <View className="flex-1 pr-2 pt-0.5">
                      <Text
                        className="text-[13px] font-medium text-gray-800"
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-[12px] font-bold text-gray-500 mt-1.5">
                        Qty: {item.quantity}
                      </Text>
                    </View>
                  </View>

                  {/* Right Section: Price */}
                  <View className="items-end pt-0.5">
                    <Text className="text-[15px] font-bold text-gray-900 pr-1">
                      ₹{item.price * item.quantity}
                    </Text>
                  </View>
                </View>
                {index !==
                  ORDER_CATEGORIES.find((c) => c.title === activeCategory)!
                    .items.length -
                    1 && <View className="border-b border-gray-200 mt-2" />}
              </View>
            ))}
          </View>
        </View>

        {/* Payment & Delivery Address */}
        <View className="mx-3 border border-gray-100 mt-2 rounded-2xl p-4 bg-white gap-3 mb-2">
          <View>
            <Text className="text-[12px] text-gray-500 font-medium mb-1">
              Delivered To
            </Text>
            <Text className="text-[13px] font-medium text-gray-800 leading-tight">
              89 Tilak Marg Barwaha, Near City Center,{"\n"}Madhya Pradesh,
              451115
            </Text>
          </View>
          <View className="h-[1px] bg-gray-100 my-1" />
          <View className="flex-row justify-between items-center">
            <Text className="text-[12px] text-gray-500 font-medium">
              Payment Method
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="card" size={16} color="#4B5563" />
              <Text className="text-[13px] font-bold text-gray-800">
                UPI - Paid
              </Text>
            </View>
          </View>
        </View>

        {/* Bill Details */}
        <View className="mx-3 border border-gray-100 rounded-2xl text-gray-100 mb-2 mt-2">
          <View className="bg-[#292524] py-2.5 px-2 rounded-t-2xl">
            <Text className="text-[16px] font-semibold text-gray-100">
              Bill Details
            </Text>
          </View>
          <View className="gap-1 p-2 bg-[#292524]">
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] text-gray-100 underline">
                Item Total
              </Text>
              <Text className="text-[13px] font-medium text-gray-100">
                ₹1,867
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] text-gray-100 underline">
                Delivery Fee
              </Text>
              <Text className="text-[13px] font-medium text-gray-100">₹40</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] text-gray-100 underline">
                Platform Fee
              </Text>
              <Text className="text-[13px] font-medium text-gray-100">₹5</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] text-green-600 font-medium">
                Coupon Discount
              </Text>
              <Text className="text-[13px] font-medium text-green-600">
                -₹50
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center px-2 py-4 bg-[#292524] rounded-b-xl border-t-[0.5px] border-white">
            <Text className="text-[15px] font-bold text-gray-100">
              Total To Pay
            </Text>
            <Text className="text-[15px] font-bold text-gray-100">₹1,862</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View
        className="px-4 py-3 border-t border-gray-200 bg-white flex-row items-center justify-between gap-3"
        style={{
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -4 },
        }}
      >
        <Pressable
          onPress={handlePresentModalPress}
          className="flex-1 rounded-xl py-3.5 flex-row items-center justify-center active:opacity-70 bg-white border border-gray-300"
        >
          <Ionicons
            name="document-text-outline"
            size={18}
            color="#374151"
            style={{ marginRight: 6 }}
          />
          <Text className="font-bold text-[14px] text-gray-700">Invoice</Text>
        </Pressable>

        <Pressable className="flex-1 rounded-xl py-3.5 flex-row items-center justify-center active:opacity-80 bg-orange-600">
          <Ionicons
            name="refresh"
            size={18}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text className="text-[14px] text-white font-bold tracking-wide">
            Reorder
          </Text>
        </Pressable>
      </View>

      {/* Invoice Options Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["42%"]}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom + 20, 40),
          }}
        >
          <View className="gap-3">
            <Pressable
              onPress={handleViewPdf}
              className="flex-row items-center p-4 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100"
            >
              <Ionicons name="eye-outline" size={22} color="#1f2937" />
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-gray-800">View PDF</Text>
                <Text className="text-[12px] text-gray-500 mt-0.5">
                  Open invoice in PDF viewer
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>

            <Pressable
              onPress={handleDownloadPdf}
              className="flex-row items-center p-4 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100"
            >
              <Ionicons name="download-outline" size={22} color="#1f2937" />
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-gray-800">
                  Download to Device
                </Text>
                <Text className="text-[12px] text-gray-500 mt-0.5">
                  Save as PDF to local storage
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>

            <Pressable
              onPress={handleDownloadPdf}
              className="flex-row items-center p-4 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100"
            >
              <Ionicons name="mail-outline" size={22} color="#1f2937" />
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-gray-800">
                  Send to Email
                </Text>
                <Text className="text-[12px] text-gray-500 mt-0.5">
                  user@example.com
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default OrderSummary;
