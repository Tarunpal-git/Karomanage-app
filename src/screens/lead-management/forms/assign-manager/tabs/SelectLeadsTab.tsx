import { StyleSheet, View } from "react-native";
import React, { FC, useMemo } from "react";

import ThemeScrollView from "../../../../../@ui/theme-scroll-view/ThemeScrollView";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import Flex from "../../../../../@ui/flex/Flex";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TScreenNavigator } from "../../../../../types/navigator/screen-navigator";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../../../colors";
import CheckBox from "../../../../../@ui/check-box/CheckBox";
import { useFormEnquiriesQuery } from "../../../../../apis/hooks/lead-management/query/useFormEnquiries.query";

interface ISelectLeadsTab {
  setTab: React.Dispatch<React.SetStateAction<string>>;
  assignedLeads: TFormEnquiry[];
  setAssignedLeads: React.Dispatch<React.SetStateAction<TFormEnquiry[]>>;
  formTemplateId: string;
}

const SelectLeadsTab: FC<ISelectLeadsTab> = ({
  setTab,
  assignedLeads,
  setAssignedLeads,
  formTemplateId,
}) => {
  const navigation = useNavigation<TScreenNavigator>();

  const { data, isLoading, refetch } = useFormEnquiriesQuery(formTemplateId);
  const enquiries: TFormEnquiry[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return data?.data;
    } else {
      return data;
    }
  }, [isLoading, data]);

  const handleToggleLead = (
    query: TFormEnquiry,
    previousMember: TFormEnquiry[]
  ) => {
    if (previousMember.includes(query)) {
      // If query is already in the array, remove it
      return previousMember.filter((member) => member !== query);
    } else {
      // If query is not in the array, add it
      return [...previousMember, query];
    }
  };

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
            ></Col>
            <Col style={styles.headerColumn}>
              <ScalableText style={styles.headerTitle} fontFamily="SemiBold">
                Name
              </ScalableText>
            </Col>
            <Col style={styles.headerColumn}>
              <ScalableText style={styles.headerTitle} fontFamily="SemiBold">
                Email
              </ScalableText>
            </Col>
          </Row>
          {enquiries.map((query) => (
            <Flex
              onClick={() =>
                setAssignedLeads((previousMember) =>
                  handleToggleLead(query, previousMember)
                )
              }
              key={query.formId}
              styles={styles.dataRow}
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
                  checked={assignedLeads.includes(query)}
                  size={17}
                />
              </Col>
              <Col style={{ ...styles.dataColumn }}>
                <Flex>
                  <ScalableText style={styles.dataText} fontFamily="Regular">
                    {query.formData.name}
                  </ScalableText>
                </Flex>
              </Col>
              <Col style={styles.dataColumn}>
                <ScalableText style={styles.dataText} fontFamily="Regular">
                  {query.formData.email}
                </ScalableText>
              </Col>
            </Flex>
          ))}

          {enquiries.length === 0 && (
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
          onPress={() => setTab("approve")}
          disabled={assignedLeads.length === 0}
        >
          <ScalableText
            fontFamily="SemiBold"
            style={{
              ...styles.text,
              fontSize: 16,
              color: assignedLeads.length > 0 ? COLORS.primary : "#9A9A9A",
            }}
          >
            {"Continue"}
          </ScalableText>
        </TouchableOpacity>
      </Flex>
    </View>
  );
};

export default SelectLeadsTab;

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
    height: 60,
  },
  dataColumn: {
    justifyContent: "center",
    alignItems: "center",
  },
  dataText: {
    fontSize: 12,
    textAlign: "center",
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