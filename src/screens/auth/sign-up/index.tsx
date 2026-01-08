import React, { useEffect } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import Center from "../../../@ui/center/Center";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { styles } from "./styles";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import Button from "../../../@ui/button/Button";
import { useSignInMutation } from "../../../apis/hooks/auth/mutation/useSignIn.mutation";
import { useAppDispatch } from "../../../app/hooks";
import { login } from "../../../app/reducer/auth/auth-reducer";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { TAuthNavigator } from "../../../navigators/auth-navigator/AuthNavigator";

const SignUpScreen = () => {
  const { isPending, mutateAsync } = useSignInMutation();
  const navigation = useNavigation<TAuthNavigator>();
  const dispatch = useAppDispatch();

  const { params } = useRoute<RouteProp<TAuthNavigatorParams>>();

  const handleSignIn = async (id_token: string) => {
    const res = await mutateAsync({
      id_token: id_token,
    });
    if (res.statusCode === 200) {
      dispatch(login(res));
    } else {
      customAlert.show({
        message: res.errorMessage,
      });
    }
  };

  useEffect(() => {
    if (params?.authenticated && params.id_token) {
      handleSignIn(params.id_token);
    }
  }, [params]);

  return (
    <SafeView>
      <ThemeScrollView>
        <Center>
          <AutoHeightImage source={IMAGES.signup} width={384} />
          <ScalableText fontFamily="SemiBold" style={styles.title}>
            Welcome to{" "}
            <ScalableText
              fontFamily="SemiBold"
              style={{ ...styles.title, color: COLORS.secondary }}
            >
              karo
            </ScalableText>
            <ScalableText
              fontFamily="SemiBold"
              style={{ ...styles.title, color: COLORS.primary }}
            >
              manage!
            </ScalableText>
          </ScalableText>
          <ScalableText style={styles.description} fontFamily="Regular">
            Please sign-in to your account{"\n"} and start the adventure.
          </ScalableText>
          <Flex my={57}>
            <Button
              loading={isPending}
              disabled={isPending}
              onPress={() => navigation.navigate("MsalAuthWebView")}
              btnStyles={{ width: 201 }}
              title="Sign in"
            />
          </Flex>
        </Center>
      </ThemeScrollView>
    </SafeView>
  );
};

export default SignUpScreen;
