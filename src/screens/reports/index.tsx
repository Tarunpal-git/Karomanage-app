import { StyleSheet, ToastAndroid, View } from "react-native";
import React, { useMemo, useState } from "react";
import SafeView from "../../@ui/safe-view/SafeView";
import AppHeader from "../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../types/navigator/screen-navigator";
import ThemeScrollView from "../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../@ui/flex/Flex";
import SelectDropdown from "../../@ui/select-dropdown/SelectDropdown";
import { useListReportsQuery } from "../../apis/hooks/reports/query/useListReports.query";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../colors";
import { convertString } from "../attendance/employe-attendance/columns/markedAttendanceEmployeesColumns";
import CheckBox from "../../@ui/check-box/CheckBox";

import AutoHeightImage from "../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import { useGetCommonOrgReportsQuery } from "../../apis/hooks/reports/query/useGetCommonOrgReports.query";
import Pdf from "react-native-pdf";
import ActionIcon from "../../@ui/action-icon/ActionIcon";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Center from "../../@ui/center/Center";

const Reports = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [reportType, setReportType] = useState("yearly");
  const { data, isLoading } = useListReportsQuery(reportType);

  const [selectedReport, setSelectedReport] = useState("");

  const reportsList: string[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return data.data;
    } else {
      return [];
    }
  }, [isLoading, data]);

  const { data: reportData, isLoading: reportLoading } =
    useGetCommonOrgReportsQuery(
      reportType,
      selectedReport,
      selectedReport !== ""
    );

  const report = useMemo(() => {
    if (!reportLoading && reportData?.statusCode === 200) {
      return reportData.data;
    } else {
      return undefined;
    }
  }, [reportLoading, reportData]);

  const downloadReport = async () => {
    const filePath = `${RNFS.DocumentDirectoryPath}/report_${reportType}_${selectedReport}.pdf`;

    await RNFS.writeFile(filePath, report, "base64");
    ToastAndroid.show("Report downloaded in the device", ToastAndroid.SHORT);

    FileViewer.open(filePath)
      .then(() => {
        // success
      })
      .catch((error) => {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      });
  };

  return (
    <SafeView>
      <AppHeader title="Reports" handleBackClick={() => navigation.goBack()} />
      <ThemeScrollView loading={isLoading} refreshControl={undefined}>
        <Flex mt={5} mb={10}>
          <SelectDropdown
            label=""
            onChange={(e) => {
              setReportType(e);
              setSelectedReport("");
            }}
            options={[
              {
                label: "Yearly",
                value: "yearly",
              },
              {
                label: "Half-Yearly",
                value: "halfYearly",
              },
              {
                label: "Quarterly",
                value: "quarterly",
              },
              {
                label: "Monthly",
                value: "monthly",
              },
              {
                label: "Weekly",
                value: "weekly",
              },
            ]}
            value={{
              label: "Yearly",
              value: "yearly",
            }}
          />
        </Flex>
        <Flex>
          <View style={styles.rootContainer}>
            <Grid style={styles.tableContainer}>
              <Row style={styles.headerRow}>
                <Col style={styles.headerColumn} size={2.5}>
                  <ScalableText style={styles.headerTitle} fontFamily="Medium">
                    {convertString(reportType)} Reports
                  </ScalableText>
                </Col>
                <Col style={styles.headerColumn} size={2}>
                  <ScalableText style={styles.headerTitle} fontFamily="Medium">
                    Downloads
                  </ScalableText>
                </Col>
              </Row>
              {reportsList.length === 0 && (
                <Center>
                  <ScalableText
                    fontFamily="Medium"
                    style={{ color: COLORS.textSecondary, fontSize: 12 }}
                  >
                    Data not found
                  </ScalableText>
                </Center>
              )}
              {reportsList.map((report) => (
                <Flex
                  onClick={() => setSelectedReport(report)}
                  key={report}
                  styles={styles.dataRow}
                >
                  <Col style={styles.dataColumn} size={2.5}>
                    <Flex w={"100%"}>
                      <CheckBox
                        checked={selectedReport === report}
                        rounded
                        size={12}
                      />
                      <ScalableText
                        style={{ ...styles.dataText, marginLeft: 8 }}
                        fontFamily="Medium"
                      >
                        {report}
                      </ScalableText>
                    </Flex>
                  </Col>
                  <Col style={styles.dataColumn} size={2}>
                    <ScalableText
                      style={styles.dataMutedText}
                      fontFamily="Medium"
                    >
                      Download
                    </ScalableText>
                  </Col>
                </Flex>
              ))}
            </Grid>
          </View>
        </Flex>
        <Flex
          justify="center"
          styles={{
            ...styles.tableContainer,
            minHeight: 236,
            padding: 10,
          }}
        >
          {!selectedReport && (
            <Flex flexDirection="column">
              <AutoHeightImage source={IMAGES.fileSearchIcon} width={69} />
              <ScalableText
                fontFamily="Medium"
                style={{ color: "#b1b1b1", marginTop: 29 }}
              >
                Your report will show here
              </ScalableText>
            </Flex>
          )}

          {!!selectedReport && !report && (
            <Flex flexDirection="column">
              <AutoHeightImage source={IMAGES.fileSearchIcon} width={69} />
              <ScalableText
                fontFamily="Medium"
                style={{ color: "#b1b1b1", marginTop: 29 }}
              >
                Sorry No Data Found
              </ScalableText>
            </Flex>
          )}

          {!!selectedReport && report && (
            <Flex>
              <Pdf
                source={{ uri: `data:application/pdf;base64,${report}` }}
                onError={() => {
                  ToastAndroid.show("Failed to load pdf", ToastAndroid.SHORT);
                }}
                style={{
                  width: 275,
                  minHeight: 236,
                  backgroundColor: COLORS.white,
                }}
                showsVerticalScrollIndicator
                scale={1.2}
              />
              <ActionIcon
                onPress={downloadReport}
                styles={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  paddingVertical: 5,
                }}
              >
                <AutoHeightImage
                  source={IMAGES.icRoundDownloadIcon}
                  width={16}
                />
              </ActionIcon>
            </Flex>
          )}
        </Flex>
      </ThemeScrollView>
    </SafeView>
  );
};

export default Reports;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 0,
    marginTop: 20,
  },
  tableContainer: {
    backgroundColor: COLORS.white,
    elevation: 4,
    borderRadius: 10,
    marginTop: 10,
    minHeight: 300,
  },
  headerRow: {
    backgroundColor: COLORS.primary,
    height: 52,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  headerColumn: {
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 14,
    textTransform: "capitalize",
    textAlign: "center",
  },

  dataRow: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 0.8,
    height: 50,
    marginHorizontal: 10,
    // paddingHorizontal: 10,
  },
  dataColumn: {
    justifyContent: "center",
    alignItems: "center",
  },
  dataText: {
    fontSize: 14,
    marginTop: 3,
  },
  dataMutedText: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 5,
  },
});
