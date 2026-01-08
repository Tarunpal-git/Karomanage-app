import { StyleSheet, View } from "react-native";
import React, { FC, memo } from "react";
import { COLORS } from "../../../../../colors";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import moment from "moment";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";

interface IAnnouncementHistory {
  announcements: TAnnouncementData[];
}

const AnnouncementHistory: FC<IAnnouncementHistory> = ({ announcements }) => {
  return (
    <View style={styles.rootContainer}>
      <Grid style={styles.tableContainer}>
        <Row style={styles.headerRow}>
          <Col style={styles.headerColumn} size={2.5}>
            <ScalableText style={styles.headerTitle} fontFamily="Medium">
              Campaign Name
            </ScalableText>
          </Col>
          <Col style={styles.headerColumn} size={2}>
            <ScalableText style={styles.headerTitle} fontFamily="Medium">
              Date & Time
            </ScalableText>
          </Col>
          <Col style={styles.headerColumn} size={1}>
            <ScalableText style={styles.headerTitle} fontFamily="Medium">
              Medium
            </ScalableText>
          </Col>
        </Row>
        {announcements.map((campaign) => (
          <Row key={campaign.dateCreated} style={styles.dataRow}>
            <Col style={styles.dataColumn} size={2.5}>
              <ScalableText style={styles.dataText} fontFamily="Regular">
                {campaign?.campaignName}
              </ScalableText>
            </Col>
            <Col style={styles.dataColumn} size={2}>
              <ScalableText style={styles.dataText} fontFamily="Regular">
                {moment.unix(campaign.dateCreated / 1000).format("DD-MM-YYYY")}
              </ScalableText>
              <ScalableText style={styles.dataMutedText} fontFamily="Regular">
                {moment.unix(campaign.dateCreated / 1000).format("hh:mm A")}
              </ScalableText>
            </Col>

            <Col
              style={{ ...styles.dataColumn, alignItems: "center" }}
              size={1}
            >
              <AutoHeightImage
                source={
                  campaign.medium === "email"
                    ? IMAGES.emailIcon
                    : IMAGES.whatsAppIcon
                }
                width={21}
              />
            </Col>
          </Row>
        ))}
        {announcements.length === 0 && (
          <Col
            style={{ ...styles.dataColumn, height: 250, alignItems: "center" }}
          >
            <ScalableText fontFamily="SemiBold">No Record Found</ScalableText>
          </Col>
        )}
      </Grid>
    </View>
  );
};

export default memo(AnnouncementHistory);

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 0,
    marginTop: 20,
  },
  tableContainer: {
    backgroundColor: COLORS.white,
    // elevation: 4,
    borderRadius: 10,
    marginTop: 10,
  },
  headerRow: {
    backgroundColor: COLORS.primary,
    height: 54,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerColumn: {
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 14,
  },

  dataRow: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 0.8,
    height: 65,
    marginHorizontal: 10,
    // paddingHorizontal: 10,
  },
  dataColumn: {
    justifyContent: "center",
    // alignItems: "center",
  },
  dataText: {
    fontSize: 12,
  },
  dataMutedText: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 5,
  },
});
