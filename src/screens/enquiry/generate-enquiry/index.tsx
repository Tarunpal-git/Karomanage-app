import React, { useEffect, useMemo, useRef, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import ActionIcon from "../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { StyleSheet, View, TouchableOpacity, Modal, Alert } from "react-native";
import { COLORS } from "../../../colors";
import Input from "../../../@ui/input/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../../@ui/button/Button";
import { useBottomSheet } from "../../../context/bottom-sheet/BottomSheetContext";
import { forms } from "../../../forms";
import CreateEnquiryConfirmation from "./components/CreateEnquiryConfirmation";
import ControlledSelect from "../../../@ui/controlled-select/ControlledSelect";
import { useCourseListsQuery } from "../../../apis/hooks/course/query/useCourseLists.query";
import { useGetEmailNotificationQuery } from "../../../apis/hooks/organization/query/useGetEmailNotification.query";
import { useSendOTPMutation } from "../../../apis/hooks/enquiry/mutation/useSendOTP.mutation";
import { useCaptchaResponseMutation } from "../../../apis/hooks/enquiry/mutation/useCaptchaResponse.mutation";
import { useGetWalletHistoryQuery } from "../../../apis/hooks/organization/query/useGetWalletHistory.query";
import CryptoJS from "crypto-js";
import Config from "react-native-config";
import { WebView } from "react-native-webview";

const GenerateEnquiry = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [enquiryConfirmation, setEnquiryConfirmation] = useState<{
    show: boolean;
    data: typeof forms.generateEnquiry.values | undefined;
  }>({ show: false, data: undefined });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [checkingWallet, setCheckingWallet] = useState(false);
  const [encryptedOtpData, setEncryptedOtpData] = useState<{
    encryptedOtp: string;
    iv: string;
  } | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const webViewRef = useRef<any>(null);

  const { handlePresentModal } = useBottomSheet();

  // Fetch email notification settings
  const { data: emailNotificationData } = useGetEmailNotificationQuery();

  // Check if verified leads is enabled (same logic as web)
  const isVerifiedLeadsEnabled = useMemo(() => {
    if (!emailNotificationData) {
      return false;
    }

    if (
      emailNotificationData?.statusCode === 200 &&
      emailNotificationData?.data
    ) {
      const verifiedLeads =
        emailNotificationData.data?.notificationPermissions?.verifiedLeads;

      return (
        verifiedLeads === true ||
        verifiedLeads === "Yes" ||
        verifiedLeads === "yes" ||
        verifiedLeads === "YES" ||
        String(verifiedLeads).toLowerCase() === "true"
      );
    }
    return false;
  }, [emailNotificationData]);

  // Fetch courses from API
  const { data: courseData, isLoading: courseLoading } = useCourseListsQuery();

  // OTP mutation
  const { mutateAsync: sendOTP, isPending: isSendingOTP } = useSendOTPMutation();

  // Captcha verification mutation
  const { mutateAsync: verifyCaptcha } = useCaptchaResponseMutation();

  // Wallet query - will be called manually when needed
  const { refetch: checkWallet } = useGetWalletHistoryQuery(false);

  const handler = useForm({
    defaultValues: {
      ...forms.generateEnquiry.values,
      firstName: "",
      lastName: "",
      otp: "",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(
      forms.generateEnquiry.validation.shape({
        studentName: yup.string().test(
          "studentName",
          "First name is required",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          function (value: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { firstName } = (this as any).parent;
            // Allow if studentName is set OR firstName is set
            return !!(value || firstName);
          }
        ),
      })
    ),
    reValidateMode: "onSubmit",
    mode: "onSubmit",
  });

  // Transform courses data to dropdown options
  const COURSES_LIST: TSelectOptions[] = useMemo(() => {
    if (!courseLoading && courseData?.statusCode === 200 && Array.isArray(courseData.data)) {
      return courseData.data.map((course: any) => ({
        label: course.courseName,
        value: course.courseName,
      }));
    }
    return [];
  }, [courseData, courseLoading]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-combine firstName and lastName into studentName for validation
  const firstName = handler.watch("firstName");
  const lastName = handler.watch("lastName");
  useEffect(() => {
    const studentName = firstName 
      ? `${firstName}${lastName ? ` ${lastName}` : ""}`.trim()
      : "";
    if (studentName) {
      handler.setValue("studentName", studentName, { shouldValidate: false });
    }
  }, [firstName, lastName, handler]);

  // This handler should be called from your React Native reCAPTCHA component
  // once it returns a token (equivalent of web's onChangeCaptcha)
  const handleCaptchaSuccess = async (token: string) => {
    try {
      const res = await verifyCaptcha(token);
      if (res?.statusCode === 200) {
        setCaptchaVerified(true);
        customAlert.show({ message: "Recaptcha verified successfully" });
      } else {
        setCaptchaVerified(false);
      }
    } catch {
      setCaptchaVerified(false);
      customAlert.show({
        message: "Failed to verify captcha. Please try again.",
      });
    }
  };

  const handleSendOTP = async () => {
    const mobileNumber = handler.getValues("mobileNumber");
    if (!mobileNumber) {
      customAlert.show({ message: "Please enter mobile number first" });
      return;
    }

    if (isVerifiedLeadsEnabled && !captchaVerified) {
      customAlert.show({ message: "Please complete the CAPTCHA first" });
      return;
    }

    setCheckingWallet(true);
    try {
      // First check wallet balance
      const walletResponse = await checkWallet();

      if (
        walletResponse.data?.statusCode === 200 &&
        walletResponse.data?.data
      ) {
        const walletData = walletResponse.data.data;
        const totalAmount = parseFloat(walletData.totalAmount || "0");
        const textQuantity = Number(walletData.textQuantity ?? 0);
        const textQuantityUsed = Number(walletData.textQuantityUsed ?? 0);
        const smsBalance = textQuantity - textQuantityUsed;
        const walletStatus = walletData.walletStatus;

        // Block OTP if sms balance not available or wallet inactive (same as web)
        if (walletStatus !== "active" || smsBalance <= 0 || totalAmount <= 0) {
          setShowWalletModal(true);
          setCheckingWallet(false);
          return;
        }

        // Wallet has amount, proceed to send OTP
        try {
          const response = await sendOTP(mobileNumber);

          const hasStatusCode = response?.statusCode === 200;
          const hasVerificationCode =
            response?.verificationCode && response?.message;
          const isEmptyObject =
            response &&
            typeof response === "object" &&
            Object.keys(response).length === 0;

          if (hasStatusCode || hasVerificationCode) {
            if (response?.verificationCode) {
              setEncryptedOtpData({
                encryptedOtp: response.verificationCode.encryptedOtp,
                iv: response.verificationCode.iv,
              });
            }
            setOtpSent(true);
            setCountdown(60);
            const successMessage =
              response?.message || "OTP sent successfully";
            customAlert.show({ message: successMessage });
          } else if (isEmptyObject) {
            setOtpSent(true);
            setCountdown(60);
            customAlert.show({ message: "OTP sent successfully" });
          } else if (response?.statusCode && response.statusCode >= 400) {
            const errorMessage =
              response?.errorMessage ||
              response?.message ||
              "Failed to send OTP";
            customAlert.show({ message: errorMessage });
          } else {
            const errorMessage =
              response?.errorMessage ||
              response?.message ||
              "Failed to send OTP. Please try again.";
            customAlert.show({ message: errorMessage });
          }
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.response?.data?.errorMessage ||
            error?.message ||
            "Failed to send OTP. Please try again.";
          customAlert.show({ message: errorMessage });
        }
      } else {
        // Wallet check failed, show modal
        setShowWalletModal(true);
      }
    } catch {
      customAlert.show({
        message: "Failed to check wallet balance. Please try again.",
      });
    } finally {
      setCheckingWallet(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otp = handler.getValues("otp");

    if (!otp) {
      customAlert.show({ message: "Please enter OTP" });
      return;
    }

    if (!encryptedOtpData) {
      customAlert.show({
        message: "OTP data not available. Please request OTP again.",
      });
      return;
    }

    try {
      // Try to get SECRET_KEY from environment variable (same as web implementation)
      let SECRET_KEY_HEX =
        (Config as any).REACT_APP_SECRET_KEY ||
        (Config as any).NEXT_PUBLIC_SECRET_KEY;

      // Temporary fallback: Use hardcoded value if env variable not found
      if (!SECRET_KEY_HEX) {
        SECRET_KEY_HEX =
          "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
      }

      if (!SECRET_KEY_HEX) {
        customAlert.show({
          message: "Configuration error. Please contact support.",
        });
        return;
      }

      // Parse IV from hex string
      const iv = CryptoJS.enc.Hex.parse(encryptedOtpData.iv);

      // Parse SECRET_KEY from hex string
      const secretKey = CryptoJS.enc.Hex.parse(SECRET_KEY_HEX);

      // Parse encrypted OTP from hex string
      const encrypted = CryptoJS.enc.Hex.parse(encryptedOtpData.encryptedOtp);

      // Create CipherParams object (crypto-js format)
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: encrypted,
      });

      // Decrypt using AES-256-CBC (same algorithm as web)
      const decrypted = CryptoJS.AES.decrypt(cipherParams, secretKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedOtp = decrypted.toString(CryptoJS.enc.Utf8).trim();

      if (decryptedOtp && decryptedOtp === otp) {
        setOtpVerified(true);
        customAlert.show({ message: "OTP verified successfully" });
      } else {
        customAlert.show({ message: "Invalid OTP. Please try again." });
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      customAlert.show({
        message: "Failed to verify OTP. Please try again.",
      });
    }
  };

  const onSubmit = async (values: any) => {
    console.log("=== SUBMIT DEBUG ===");
    console.log("Form values:", values);
    console.log("Form errors:", handler.formState.errors);
    console.log("isVerifiedLeadsEnabled:", isVerifiedLeadsEnabled);
    console.log("captchaVerified:", captchaVerified);
    console.log("otpVerified:", otpVerified);
    
    // If verified leads is enabled, check OTP and CAPTCHA verification
    if (isVerifiedLeadsEnabled) {
      if (!captchaVerified) {
        const message = "Please complete the CAPTCHA first";
        console.log("Blocking submit: CAPTCHA not verified");
        if (typeof customAlert !== "undefined") {
          customAlert.show({ message });
        } else {
          Alert.alert("Required", message);
        }
        return;
      }
      if (!otpVerified) {
        const message = "Please verify your mobile number with OTP";
        console.log("Blocking submit: OTP not verified");
        if (typeof customAlert !== "undefined") {
          customAlert.show({ message });
        } else {
          Alert.alert("Required", message);
        }
        return;
      }
    }
    
    // Combine firstName and lastName into studentName for API
    const studentName = values.firstName 
      ? `${values.firstName}${values.lastName ? ` ${values.lastName}` : ""}`.trim()
      : values.studentName || "";
    
    if (!studentName) {
      const message = "First name is required";
      if (typeof customAlert !== "undefined") {
        customAlert.show({ message });
      } else {
        Alert.alert("Required", message);
      }
      return;
    }
    
    const formData = {
      ...values,
      studentName: studentName,
    };
    
    console.log("Submit allowed, proceeding with data:", formData);
    setEnquiryConfirmation({ data: formData, show: true });
  };

  return (
    <SafeView>
      <AppHeader
        leftSection={
          <ActionIcon onPress={handlePresentModal} styles={{ padding: 10 }}>
            <AutoHeightImage source={IMAGES.qrCodeIcon} width={23} />
          </ActionIcon>
        }
        title="Generate Enquiry"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />

      <ThemeScrollView paddingHorizontal={15}>
        <View style={styles.formRoot}>
          <ScalableText style={styles.formTitle} fontFamily="Medium">
            Student Details
          </ScalableText>

          <Input
            handler={handler}
            label="First Name*"
            name="firstName"
            containerStyles={{ marginBottom: 15, marginTop: 7 }}
          />
          <Input
            handler={handler}
            label="Last Name"
            name="lastName"
            containerStyles={{ marginBottom: 15 }}
          />

          {isVerifiedLeadsEnabled && (
            <View style={styles.captchaContainer}>
              <TouchableOpacity
                style={[
                  styles.captchaButton,
                  captchaVerified && styles.captchaButtonVerified,
                ]}
                activeOpacity={0.8}
                onPress={() => setShowCaptchaModal(true)}
                disabled={captchaVerified}
              >
                <ScalableText fontFamily="Regular" style={styles.captchaText}>
                  {captchaVerified ? "✓ CAPTCHA verified" : "I'm not a robot"}
                </ScalableText>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ marginBottom: 15 }}>
            <Input
              handler={handler}
              label="Phone Number*"
              name="mobileNumber"
              containerStyles={{
                marginBottom: isVerifiedLeadsEnabled ? 10 : 0,
              }}
              editable={!otpVerified || !isVerifiedLeadsEnabled}
            />
            {isVerifiedLeadsEnabled && (
              <View style={styles.otpContainer}>
                {!otpSent ? (
                  <TouchableOpacity
                    onPress={handleSendOTP}
                    disabled={
                      checkingWallet ||
                      isSendingOTP ||
                      !handler.watch("mobileNumber") ||
                      (isVerifiedLeadsEnabled && !captchaVerified)
                    }
                    style={[
                      styles.otpButton,
                      (!handler.watch("mobileNumber") ||
                        isSendingOTP ||
                        checkingWallet) &&
                        styles.otpButtonDisabled,
                    ]}
                  >
                    <ScalableText
                      fontFamily="Medium"
                      style={styles.otpButtonText}
                    >
                      {checkingWallet
                        ? "Checking..."
                        : isSendingOTP
                        ? "Sending..."
                        : "GET OTP"}
                    </ScalableText>
                  </TouchableOpacity>
                ) : (
                  <>
                    <View style={styles.otpInputContainer}>
                      <View style={{ flex: 1, marginRight: 10 }}>
                        <Input
                          handler={handler}
                          label="Enter OTP"
                          name="otp"
                          keyboardType="number-pad"
                          containerStyles={{ marginBottom: 0 }}
                          maxLength={6}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={handleVerifyOTP}
                        disabled={!handler.watch("otp") || otpVerified}
                        style={[
                          styles.verifyButton,
                          (!handler.watch("otp") || otpVerified) &&
                            styles.otpButtonDisabled,
                        ]}
                      >
                        <ScalableText
                          fontFamily="Medium"
                          style={styles.otpButtonText}
                        >
                          {otpVerified ? "Verified" : "Verify"}
                        </ScalableText>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.resendContainer}>
                      {countdown > 0 ? (
                        <ScalableText
                          fontFamily="Regular"
                          style={styles.resendText}
                        >
                          Resend in {countdown}s
                        </ScalableText>
                      ) : (
                        <TouchableOpacity
                          onPress={handleSendOTP}
                          disabled={isSendingOTP}
                        >
                          <ScalableText
                            fontFamily="Medium"
                            style={styles.resendLink}
                          >
                            Resend OTP
                          </ScalableText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
          <Input
            handler={handler}
            label="Email"
            name="email"
            containerStyles={{ marginBottom: 15 }}
          />
        </View>
        <View style={styles.formRoot}>
          <ScalableText style={styles.formTitle} fontFamily="Medium">
            Enquiry Details
          </ScalableText>
          <View style={{ marginBottom: 15, marginTop: 7 }}>
            <ControlledSelect
              handler={handler}
              name="enquiryCourse"
              label="Interested Courses*"
              options={COURSES_LIST}
              value={
                COURSES_LIST.find(
                  (option) => option.value === handler.watch("enquiryCourse")
                ) || { label: "Select course", value: "" }
              }
              dropdownButtonStyle={styles.dropdownButton}
              disabled={courseLoading}
            />
          </View>
          <Input
            handler={handler}
            label="Course Description*"
            name="courseDescription"
            containerStyles={{ marginBottom: 15 }}
          />
        </View>
        <Button
          onPress={handler.handleSubmit(onSubmit)}
          title="Submit"
          btnStyles={styles.submitBtn}
          btnTxtStyles={styles.submitBtnText}
        />
      </ThemeScrollView>
      {enquiryConfirmation.show && enquiryConfirmation.data && (
        <CreateEnquiryConfirmation
          refetch={() => handler.reset()}
          isVisible={enquiryConfirmation.show}
          data={enquiryConfirmation.data}
          handleClose={() =>
            setEnquiryConfirmation({ data: undefined, show: false })
          }
        />
      )}

      {/* CAPTCHA Full Screen Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showCaptchaModal}
        onRequestClose={() => setShowCaptchaModal(false)}
        presentationStyle="fullScreen"
      >
        <SafeView>
          <View style={styles.captchaModalContainer}>
            <View style={styles.captchaModalHeader}>
              <ScalableText fontFamily="Medium" style={styles.captchaModalTitle}>
                Complete CAPTCHA
              </ScalableText>
              <TouchableOpacity
                onPress={() => setShowCaptchaModal(false)}
                style={styles.captchaModalCloseButton}
              >
                <ScalableText fontFamily="Medium" style={styles.captchaModalCloseText}>
                  ✕
                </ScalableText>
              </TouchableOpacity>
            </View>
            <WebView
              ref={webViewRef}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                      <script src="https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoad" async defer></script>
                      <style>
                        * {
                          box-sizing: border-box;
                        }
                        body {
                          margin: 0;
                          padding: 20px;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          min-height: 100vh;
                          background: #f5f5f5;
                          width: 100%;
                        }
                        #recaptcha-container {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        }
                        /* Ensure reCAPTCHA modal can display properly */
                        .grecaptcha-badge,
                        iframe[title*="reCAPTCHA"] {
                          z-index: 999999 !important;
                        }
                      </style>
                    </head>
                    <body>
                      <div id="recaptcha-container"></div>
                      <script>
                        let recaptchaWidgetId = null;
                        function onRecaptchaLoad() {
                          recaptchaWidgetId = grecaptcha.render('recaptcha-container', {
                            'sitekey': '6Ldn0yUqAAAAAM2IfBO-XsBQhXZGhag5Apcj6MPg',
                            'callback': onCaptchaSuccess,
                            'expired-callback': onCaptchaExpired,
                            'size': 'normal',
                            'theme': 'light'
                          });
                          window.recaptchaWidgetId = recaptchaWidgetId;
                        }
                        function onCaptchaSuccess(token) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'success', token: token }));
                        }
                        function onCaptchaExpired() {
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'expired' }));
                        }
                      </script>
                    </body>
                  </html>
                `,
                baseUrl: "https://portal.karomanage.com",
              }}
              originWhitelist={["*"]}
              style={styles.captchaModalWebView}
              onMessage={(event: any) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === "success" && data.token) {
                    handleCaptchaSuccess(data.token);
                    setShowCaptchaModal(false);
                  } else if (data.type === "expired") {
                    setCaptchaVerified(false);
                  }
                } catch (error) {
                  console.error("Error parsing captcha message:", error);
                }
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={false}
              scalesPageToFit={true}
              mixedContentMode="always"
              allowsInlineMediaPlayback={true}
              sharedCookiesEnabled={true}
              thirdPartyCookiesEnabled={true}
            />
          </View>
        </SafeView>
      </Modal>

      {/* Wallet Recharge Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showWalletModal}
        onRequestClose={() => setShowWalletModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScalableText fontFamily="Medium" style={styles.modalTitle}>
              Wallet Recharge Required
            </ScalableText>
            <ScalableText fontFamily="Regular" style={styles.modalMessage}>
              Recharge your wallet through portal
            </ScalableText>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowWalletModal(false)}
            >
              <ScalableText
                fontFamily="Medium"
                style={styles.modalButtonText}
              >
                OK
              </ScalableText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeView>
  );
};

export default GenerateEnquiry;

const styles = StyleSheet.create({
  formRoot: {
    padding: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 7,
    marginVertical: 10,
    elevation: 2,
    backgroundColor: COLORS.white,
    flexDirection: "column",
  },
  formTitle: {
    fontSize: 16,
  },
  text: {
    color: "#717171",
    fontSize: 18,
  },
  continueBtn: {
    backgroundColor: "transparent",
    marginBottom: 70,
    paddingBottom: 10,
    paddingHorizontal: 30,
  },
  submitBtn: {
    width: 201,
    alignSelf: "center",
    marginVertical: 39,
  },
  submitBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
  dropdownButton: {
    marginBottom: 0,
  },
  captchaContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  captchaButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  captchaButtonVerified: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lighterBlue,
  },
  captchaText: {
    fontSize: 14,
    color: COLORS.black,
  },
  captchaModalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  captchaModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  captchaModalTitle: {
    fontSize: 18,
    color: COLORS.black,
  },
  captchaModalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  captchaModalCloseText: {
    fontSize: 18,
    color: COLORS.black,
  },
  captchaModalWebView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  otpContainer: {
    marginTop: 10,
  },
  otpButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  otpButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  otpButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
  otpInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    height: 48,
  },
  resendContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  resendText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  resendLink: {
    fontSize: 12,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: COLORS.black,
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    color: COLORS.muted,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
});

