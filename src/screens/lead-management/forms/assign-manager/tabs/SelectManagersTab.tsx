import { StyleSheet, View } from "react-native";
import React, { FC, memo, useMemo } from "react";
import ThemeScrollView from "../../../../../@ui/theme-scroll-view/ThemeScrollView";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../../colors";
import { useFetchAllUsersQuery } from "../../../../../apis/hooks/user-management/query/useFetchAllUsers.query";
import Flex from "../../../../../@ui/flex/Flex";
import CheckBox from "../../../../../@ui/check-box/CheckBox";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../../../types/navigator/screen-navigator";
import { filterActiveAndLeadAndEnquiryManager } from "../../../../../utils/filterActiveAndLeadAndEnquiryManager";

interface ISelectManagersTab {
  selectedManager: TSelectedManager | undefined;
  setSelectedManager: React.Dispatch<
    React.SetStateAction<TSelectedManager | undefined>
  >;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  leads?: TFormEnquiry[];
}

const SelectManagersTab: FC<ISelectManagersTab> = ({
  selectedManager,
  setSelectedManager,
  setTab,
  leads,
}) => {
  const { data, isLoading, refetch } = useFetchAllUsersQuery();
  const navigation = useNavigation<TScreenNavigator>();

  const userList: TUserListData[] = useMemo(() => {
    if (!isLoading && data.data) {
      return filterActiveAndLeadAndEnquiryManager(data.data);
    } else {
      return [];
    }
  }, [isLoading, data]);

  return (
    <View style={styles.tabRoot}>
      <ThemeScrollView
        paddingHorizontal={10}
        loading={isLoading}
        reloadData={refetch}
      >
        <Grid style={styles.tableContainer}>
          <Row style={styles.headerRow}>
            <Col
              style={{
                ...styles.dataColumn,
                width: 20,
              }}
            >
              {/* <CheckBox /> */}
            </Col>
            <Col style={styles.headerColumn}>
              <ScalableText style={styles.headerTitle} fontFamily="SemiBold">
                Name
              </ScalableText>
            </Col>
            <Col style={styles.headerColumn}>
              <ScalableText style={styles.headerTitle} fontFamily="SemiBold">
                Designation
              </ScalableText>
            </Col>
          </Row>
          {userList.map((user) => (
            <Flex
              key={user.employeeId}
              styles={styles.dataRow}
              onClick={() => {
                if (
                  selectedManager &&
                  selectedManager?.employeeId === user.employeeId
                ) {
                  setSelectedManager(undefined);
                } else {
                  setSelectedManager({
                    designation: user.designation,
                    employeeId: user.employeeId,
                    managerEmail: user.userEmail,
                    managerName: user.userName,
                    userId: user.userId,
                  });
                }
              }}
            >
              <Col
                style={{
                  ...styles.dataColumn,
                  width: 20,
                  marginLeft: 10,
                }}
              >
                <CheckBox
                  disabled={true}
                  size={17}
                  checked={selectedManager?.employeeId === user.employeeId}
                />
              </Col>
              <Col style={{ ...styles.dataColumn }}>
                <Flex>
                  <ScalableText style={styles.dataText} fontFamily="Regular">
                    {user.userName}
                  </ScalableText>
                </Flex>
              </Col>
              <Col style={styles.dataColumn}>
                <ScalableText style={styles.dataText} fontFamily="Regular">
                  {user.designation}
                </ScalableText>
              </Col>
            </Flex>
          ))}

          {userList.length === 0 && (
            <Col style={{ ...styles.dataColumn, height: 250 }}>
              <ScalableText fontFamily="SemiBold">No Record Found</ScalableText>
            </Col>
          )}
        </Grid>
      </ThemeScrollView>

      <Flex justify="space-between" mb={100}>
        <TouchableOpacity
          style={{ paddingHorizontal: 35 }}
          onPress={() => navigation.goBack()}
        >
          <Flex justify="flex-end">
            <ScalableText
              fontFamily="SemiBold"
              style={{
                ...styles.text,
                fontSize: 16,
                marginRight: 5,
                marginTop: 2,
              }}
            >
              {"Cancel"}
            </ScalableText>
          </Flex>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueBtn}
          disabled={!selectedManager}
          onPress={() => {
            if (leads && leads.length > 0) {
              setTab("approve");
            } else {
              setTab("selectLeads");
            }
          }}
        >
          <ScalableText
            fontFamily="SemiBold"
            style={{
              ...styles.text,
              fontSize: 16,
              color: selectedManager ? COLORS.primary : "#9A9A9A",
            }}
          >
            {"Continue"}
          </ScalableText>
        </TouchableOpacity>
      </Flex>
    </View>
  );
};

export default memo(SelectManagersTab);

const styles = StyleSheet.create({
  tabRoot: {
    flex: 1,
    marginTop: 20,
  },
  tableContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    flex: 1,
  },
  headerRow: {
    backgroundColor: COLORS.lighterBlue,
    height: 42,
  },
  headerColumn: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.black,
    fontSize: 14,
  },

  dataRow: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 0.8,
    height: 50,
  },
  dataColumn: {
    justifyContent: "center",
    alignItems: "center",
  },
  dataText: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  text: {
    color: "#9A9A9A",
    fontSize: 18,
  },
  continueBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 35,
  },
});