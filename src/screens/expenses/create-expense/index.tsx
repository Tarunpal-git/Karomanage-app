import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { forms } from "../../../forms";
import { yupResolver } from "@hookform/resolvers/yup";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Input from "../../../@ui/input/Input";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import Button from "../../../@ui/button/Button";
import { useCreateExpenseMutation } from "../../../apis/hooks/expenses/mutation/useCreateExpense.mutation";
import ControlledSelect from "../../../@ui/controlled-select/ControlledSelect";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import { useFetchAllUsersQuery } from "../../../apis/hooks/user-management/query/useFetchAllUsers.query";
import { useExpenseCategoriesQuery } from "../../../apis/hooks/expenses/query/useExpenseCategories.query";
import CreateCategoryModal from "../expenses-list/components/CreateCategoryModal";
import FileInputField from "../../../@ui/file-input/FileInputField";
import CalendarInput from "../../../@ui/calendar-input/CalendarInput";
import ScalableText from "../../../@ui/scalable-text/ScalableText";

const CreateExpense = () => {
  const navigation = useNavigation();
  const { isPending, mutateAsync } = useCreateExpenseMutation();
  const [categoryModal, setCategoryModal] = useState(false);

  const { data: userListData, isLoading: userListLoading } =
    useFetchAllUsersQuery();

  const {
    data: categoryListData,
    isLoading: categoryListLoading,
    refetch,
  } = useExpenseCategoriesQuery();

  const categoriesList = useMemo(() => {
    if (!categoryListLoading && categoryListData.statusCode === 200) {
      return categoryListData.data.expenseCategories.map(
        (category: TExpenseCategories) => ({
          label: category.categoryName,
          value: category.categoryId,
        })
      );
    } else {
      return [];
    }
  }, [categoryListLoading, categoryListData]);

  const usersList = useMemo(() => {
    if (!userListLoading && userListData.statusCode === 200) {
      return userListData.data.map((user: TUserListData) => ({
        label: user.userName,
        value: user.employeeId,
      }));
    } else {
      return [];
    }
  }, [userListLoading, userListData]);

  const handler = useForm({
    defaultValues: forms.createExpense.values,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(forms.createExpense.validation),
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (values: typeof forms.createExpense.values) => {
    const res = await mutateAsync(values);

    if (res.statusCode === 200) {
      handler.reset();
      navigation.goBack();
    } else {
      customAlert.show({
        message: "Expense not added",
      });
    }
  };

  return (
    <SafeView>
      <AppHeader
        title="Create Expense"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView paddingHorizontal={15}>
        <View style={styles.formRoot}>
          <Input
            handler={handler}
            label="Name of expenses*"
            name="expenseName"
            containerStyles={{ marginBottom: 15, marginTop: 7 }}
          />
          <Input
            handler={handler}
            label="Description"
            name="expenseDescription"
            containerStyles={{ marginBottom: 15, marginTop: 7 }}
          />
          <Input
            handler={handler}
            label="Amount*"
            name="expenseAmount"
            containerStyles={{ marginBottom: 15, marginTop: 7 }}
            keyboardType="number-pad"
          />
          <ControlledSelect
            value={{ label: "", value: "" }}
            handler={handler}
            label={userListLoading ? "Loading...." : "Paid by"}
            name="paidByEmployee"
            options={usersList ?? []}
            dropdownButtonStyle={{ marginBottom: 15, marginTop: 7 }}
          />

          <ControlledSelect
            value={{ label: "", value: "" }}
            handler={handler}
            label="Expense payment status*"
            name="expensePaymentStatus"
            options={[
              { label: "Paid", value: "paid" },
              { label: "Due", value: "due" },
            ]}
            dropdownButtonStyle={{ marginBottom: 15, marginTop: 7 }}
          />

          <Flex>
            <ControlledSelect
              value={{ label: "", value: "" }}
              handler={handler}
              label={categoryListLoading ? "Loading....." : "Category"}
              name="categoryId"
              options={categoriesList ?? []}
              dropdownButtonStyle={{ marginBottom: 15, marginTop: 7 }}
            />

            <Button
              btnStyles={{
                ...styles.modalBtn,
                borderWidth: 1,
                borderColor: COLORS.primary,
                backgroundColor: COLORS.white,
                height: 41,
                width: 113,
                marginBottom: 20,
                marginLeft: 7,
              }}
              btnTxtStyles={{
                ...styles.modalBtnText,
                color: COLORS.primary,
                fontSize: 11,
              }}
              title="Create"
              onPress={() => setCategoryModal(true)}
              rightIcon={
                <Flex ml={7}>
                  <AutoHeightImage source={IMAGES.createIcon} width={14} />
                </Flex>
              }
            />
          </Flex>

          <Flex mb={15} mt={7}>
            <FileInputField handler={handler} name="file" />
          </Flex>

          <Flex mb={15} mt={7} flexDirection="column" align="flex-start">
            <CalendarInput
              label="Expenditure date*"
              handler={handler}
              name="expensedateCreated"
            />

            {handler.formState.errors && (
              <ScalableText
                fontFamily="Regular"
                style={{
                  color: COLORS.error,
                  fontSize: 10,
                }}
              >
                {
                  handler.formState?.errors?.expensedateCreated
                    ?.message as string
                }
              </ScalableText>
            )}
          </Flex>

          <Flex mt={10} justify="center">
            <Button
              btnStyles={{
                ...styles.modalBtn,
                borderWidth: 1,
                borderColor: COLORS.primary,
                backgroundColor: COLORS.white,
              }}
              btnTxtStyles={{ ...styles.modalBtnText, color: COLORS.primary }}
              title="Cancel"
              onPress={() => navigation.goBack()}
            />
            <Button
              btnStyles={styles.modalBtn}
              btnTxtStyles={styles.modalBtnText}
              title="Create"
              disabled={isPending}
              loading={isPending}
              onPress={handler.handleSubmit(onSubmit)}
            />
          </Flex>
        </View>
      </ThemeScrollView>
      {categoryModal && (
        <CreateCategoryModal
          handleClose={() => setCategoryModal(false)}
          isVisible={categoryModal}
          refetch={refetch}
        />
      )}
    </SafeView>
  );
};

export default CreateExpense;

const styles = StyleSheet.create({
  formRoot: {
    padding: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 7,
    marginVertical: 5,
    elevation: 2,
    backgroundColor: COLORS.white,
    flexDirection: "column",
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    width: 89,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    marginHorizontal: 3,
  },
  modalBtnText: {
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: "Poppins-Regular",
  },
});
