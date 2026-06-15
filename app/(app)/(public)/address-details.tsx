import AddressDetailsInput from "@/src/components/location/AddressDetailsInput";
import LabelSelectors from "@/src/components/location/LabelSelectors";
import LocationInfoCard from "@/src/components/location/LocationInfoCard";
import ReceiverDetailsInput from "@/src/components/location/ReceiverDetailsInput";
import Header from "@/src/components/ui/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { router } from "expo-router";
import { styled } from "nativewind";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { type AddressLabel, useAddressStore } from "@/src/store/addressStore";

// ─── Styled ───────────────────────────────────────────────────────────────────

const SafeAreaView = styled(RNSafeAreaView);

// ─── Schema ───────────────────────────────────────────────────────────────────

export const addressSchema = z
  .object({
    selectedLabel: z.string(),

    customLabel: z
      .string()
      .trim()
      .regex(/^\S*$/, "Spaces are not allowed")
      .optional()
      .nullable(),

    line: z.string().min(1, "Required"),

    receiverName: z.string().min(1, "Name is required"),

    receiverPhone: z
      .string()
      .regex(/^[0-9]+$/, "Only numbers allowed")
      .length(10, "Invalid number"),
  })
  .superRefine((data, ctx) => {
    if (data.selectedLabel === "other" && !data.customLabel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customLabel"],
        message: "Required",
      });
    }
  });

export type AddressFormValues = z.infer<typeof addressSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

const AddressDetails = () => {
  const draft = useAddressStore((s) => s.draft);
  const setDraftLabel = useAddressStore((s) => s.setDraftLabel);
  const setDraftCustomLabel = useAddressStore((s) => s.setDraftCustomLabel);
  const setDraftLine1 = useAddressStore((s) => s.setDraftLine1);
  const setDraftReceiver = useAddressStore((s) => s.setDraftReceiver);
  const clearDraft = useAddressStore((s) => s.clearDraft);

  // ── Guard — no draft means user landed here without going through Page 1 ──

  useEffect(() => {
    if (!draft) {
      router.replace("/");
    }
  }, [draft]);

  // ── Form ──────────────────────────────────────────────────────────────────

  const {
    control,
    handleSubmit,
    getValues,
    formState: { submitCount },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      selectedLabel: draft?.label ?? "home",
      customLabel: draft?.customLabel ?? "",
      line: draft?.line1 ?? "",
      receiverName: draft?.receiverName ?? "",
      receiverPhone: draft?.receiverPhone ?? "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // ── Sync RHF state → draft (called on back-nav so Page 1 → Page 2 ────────
  // ── re-hydration preserves whatever the user had typed) ──────────────────

  const syncDraftFromForm = (data: AddressFormValues) => {
    setDraftLabel(data.selectedLabel as AddressLabel);
    setDraftCustomLabel(
      data.selectedLabel === "other" ? (data.customLabel ?? null) : null,
    );
    setDraftLine1(data.line);
    setDraftReceiver(data.receiverName || null, data.receiverPhone || null);
  };

  // ── Back to map — preserve typed values in draft ──────────────────────────

  const handleBackToMap = () => {
    syncDraftFromForm(getValues());
    router.back();
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = (data: AddressFormValues) => {
    // draft is guaranteed non-null here (guard above), but TS needs the check
    if (!draft) return;

    const finalPayload = {
      geocoded: draft.geocoded,
      coordinates: draft.coordinates,
      label: data.selectedLabel,
      customLabel:
        data.selectedLabel === "other" ? (data.customLabel ?? null) : null,
      line1: data.line,
      receiverName: data.receiverName || null,
      receiverPhone: data.receiverPhone || null,
    };

    // TODO: replace with API call → addSavedAddress() → setActiveAddress()
    console.log(
      "🚀 Final Address Payload:\n",
      JSON.stringify(finalPayload, null, 2),
    );

    clearDraft();
    router.push("/home");
  };

  // ── Early return while redirect fires ────────────────────────────────────

  if (!draft) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1">
      <Header title="Address details" back border onBack={handleBackToMap} />

      <View className="flex-1 mx-4 gap-5 pt-6">
        {/* Label selector */}
        <View className="gap-1.5">
          <Text className="form-input-label">Select Label</Text>
          <LabelSelectors control={control} />
        </View>

        {/* Flat / house / building line */}
        <Controller
          control={control}
          name="line"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AddressDetailsInput
              value={value}
              onChangeText={onChange}
              hasError={!!error}
              errorMessage={error?.message}
              submitCount={submitCount}
            />
          )}
        />

        {/* Receiver Details (Compound Component) */}
        <Controller
          control={control}
          name="receiverName"
          render={({
            field: { onChange: onChangeName, value: name },
            fieldState: { error: nameError },
          }) => (
            <Controller
              control={control}
              name="receiverPhone"
              render={({
                field: { onChange: onChangePhone, value: phone },
                fieldState: { error: phoneError },
              }) => (
                <ReceiverDetailsInput
                  name={name}
                  phone={phone}
                  onChangeName={onChangeName}
                  onChangePhone={onChangePhone}
                  hasNameError={!!nameError}
                  hasPhoneError={!!phoneError}
                  phoneErrorMessage={phoneError?.message}
                  submitCount={submitCount}
                />
              )}
            />
          )}
        />

        {/* Geocoded address card — tapping "Change" syncs & goes back */}
        <LocationInfoCard
          line1={draft.geocoded?.line1}
          formattedAddress={draft.geocoded?.formattedAddress}
          onChangeAddress={handleBackToMap}
        />

        {/* Save button */}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          className={clsx(
            "rounded-full py-2 items-center justify-center",
            "bg-orange-500",
            "active:opacity-70",
          )}
        >
          <Text className="text-lg text-white font-bold">Save Address</Text>
        </Pressable>

        {/* Disclaimer */}
        <Text className="text-gray-400 text-[12px]">
          This address may differ from your regional address. It reflects the
          exact pin location you selected on the map or your current live
          location, which we will use to deliver your order accurately.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AddressDetails;
