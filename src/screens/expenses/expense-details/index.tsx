import { StyleSheet, ToastAndroid, View } from "react-native";
import React, { useMemo } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useExpenseDetailsQuery } from "../../../apis/hooks/expenses/query/useExpenseDetails.query";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import Avatar from "../../../@ui/avatar/Avatar";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { useExpenseCategoriesQuery } from "../../../apis/hooks/expenses/query/useExpenseCategories.query";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import ActionIcon from "../../../@ui/action-icon/ActionIcon";
import RNFS from "react-native-fs";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { isEmptyString } from "../../../utils/isEmptyString";

const extractBase64ContentAndExtension = (file: string) => {
  const match = file.match(/^data:image\/([a-zA-Z]+);base64,/);
  if (!match) {
    throw new Error("Invalid base64 image string");
  }
  const extension = match[1]; // get the extension
  const base64Content = file.replace(match[0], ""); // remove the prefix
  return { base64Content, extension };
};

const ExpenseDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { expenseId, expenseName } =
    useRoute<RouteProp<TExpensesStackNavigatorParams, "ExpenseDetails">>()
      .params;

  const { data, isLoading, refetch } = useExpenseDetailsQuery(expenseId);

  const {
    data: categoryResponseData,
    isLoading: categoryLoading,
    refetch: reloadCategories,
  } = useExpenseCategoriesQuery();

  const expenseDetails: TExpenseData = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return data.data;
    } else {
      return undefined;
    }
  }, [data, isLoading]);

  const categories: TExpenseCategories[] = useMemo(() => {
    if (!categoryLoading && categoryResponseData.statusCode === 200) {
      return categoryResponseData.data.expenseCategories;
    } else {
      return [];
    }
  }, [categoryResponseData, categoryLoading]);

  const getCategoryDetailsById = (categoryId: string) => {
    if (categories.length > 0) {
      return categories.filter(
        (category) => category.categoryId === categoryId
      );
    } else {
      return undefined;
    }
  };

  const downloadFile = (file: string) => {
    const { base64Content, extension } = extractBase64ContentAndExtension(file);

    const filePath = `${RNFS.CachesDirectoryPath}/receipt_${expenseDetails?.expenseName}.${extension}`;

    RNFS.writeFile(
      `${RNFS.CachesDirectoryPath}/receipt_${expenseDetails?.expenseName}.${extension}`,
      base64Content,
      "base64"
    )
      .then(async () => {
        ToastAndroid.show(
          "Receipt saved in the camera roll",
          ToastAndroid.SHORT
        );
        return CameraRoll.save(`file://${filePath}`);
      })
      .catch((err) => {
        ToastAndroid.show(err, ToastAndroid.SHORT);
      });
  };

  return (
    <SafeView>
      <AppHeader
        title={"Single Details"}
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView
        reloadData={() => {
          refetch();
          reloadCategories();
        }}
        loading={isLoading || categoryLoading}
      >
        <View style={styles.formRoot}>
          <Flex flexDirection="column" my={24}>
            <Avatar
              content={expenseName ?? ""}
              size={53}
              textStyle={{ fontSize: 20 }}
            />
            <ScalableText
              style={{ color: COLORS.primary, fontSize: 16, marginTop: 12 }}
              fontFamily="Bold"
            >
              {expenseName}
            </ScalableText>
          </Flex>
          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Id:
            </ScalableText>
            <ScalableText style={styles.detailsContent} fontFamily="Medium">
              {isEmptyString(expenseDetails?.expenseId)}
            </ScalableText>
          </Flex>

          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Name:{" "}
            </ScalableText>
            <ScalableText style={styles.detailsContent} fontFamily="Medium">
              {isEmptyString(expenseDetails?.expenseName)}{" "}
            </ScalableText>
          </Flex>
          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Amount:
            </ScalableText>
            <ScalableText style={styles.detailsContent} fontFamily="Medium">
              {Number(expenseDetails?.expenseAmount).toLocaleString()}
            </ScalableText>
          </Flex>
          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Description:
            </ScalableText>
            <ScalableText style={styles.detailsContent} fontFamily="Medium">
              {isEmptyString(expenseDetails?.expenseDescription)}
            </ScalableText>
          </Flex>
          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Category:
            </ScalableText>
            <ScalableText style={styles.detailsContent} fontFamily="Medium">
              {isEmptyString(
                getCategoryDetailsById(
                  expenseDetails?.expenseCategories?.[0]?.categoryId ?? ""
                )?.[0]?.categoryName
              )}
            </ScalableText>
          </Flex>
          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Category Description:
            </ScalableText>
            <ScalableText style={styles.detailsContent} fontFamily="Medium">
              {isEmptyString(
                getCategoryDetailsById(
                  expenseDetails?.expenseCategories?.[0]?.categoryId ?? ""
                )?.[0]?.categoryDescription
              )}
            </ScalableText>
          </Flex>
        </View>

        {expenseDetails?.file && (
          <Flex
            styles={{ ...styles.formRoot, borderLeftWidth: 0 }}
            flexDirection="column"
            mt={25}
          >
            <Flex justify="flex-end" w={"100%"} mt={20}>
              <ActionIcon
                onPress={() => downloadFile(expenseDetails?.file ?? "")}
              >
                <AutoHeightImage
                  source={IMAGES.icRoundDownloadIcon}
                  width={16}
                />
              </ActionIcon>
            </Flex>
            <AutoHeightImage
              source={{ uri: expenseDetails.file }}
              width={300}
            />
          </Flex>
        )}
      </ThemeScrollView>
    </SafeView>
  );
};

export default ExpenseDetails;

const styles = StyleSheet.create({
  formRoot: {
    padding: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 7,
    marginVertical: 5,
    elevation: 2,
    backgroundColor: COLORS.white,
    flexDirection: "column",
  },
  detailsHeading: {
    fontSize: 16,
    marginRight: 10,
  },
  detailsContent: {
    color: "#646464",
    fontSize: 14,
    textTransform: "capitalize",
  },
});
