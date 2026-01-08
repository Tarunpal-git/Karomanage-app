import React, { useMemo, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import { useStudentsListQuery } from "../../../apis/hooks/students/query/useStudentsList.query";
import moment from "moment";
import Avatar from "../../../@ui/avatar/Avatar";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { Col, Grid, Row } from "react-native-easy-grid";
import CustomHorizontalScrollView from "../../../@ui/custom-horizontal-scrollview/CustomHorizontalScrollView";

const StudentCalendarView = () => {
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [searchQuery, setSearchQuery] = useState("");

  const { data: studentsData, isLoading } = useStudentsListQuery({});

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!studentsData?.data || !Array.isArray(studentsData.data)) return [];
    
    // Skip the first element if it's a summary object
    const students = studentsData.data.filter(
      (item: any) => item.studentEnrollmentNumber
    );

    if (!searchQuery) return students;

    const query = searchQuery.toLowerCase();
    return students.filter((student: any) => {
      const name = `${student.studentFirstName || ""} ${student.studentLastName || ""}`.toLowerCase();
      const enrollment = student.studentEnrollmentNumber?.toLowerCase() || "";
      const rollNo = student.rollNo?.toLowerCase() || "";
      return name.includes(query) || enrollment.includes(query) || rollNo.includes(query);
    });
  }, [studentsData, searchQuery]);

  // Get days in the selected month
  const daysInMonth = useMemo(() => {
    const days = [];
    const daysCount = moment().year(selectedYear).month(selectedMonth).daysInMonth();
    for (let i = 1; i <= daysCount; i++) {
      const date = moment().year(selectedYear).month(selectedMonth).date(i);
      days.push({
        day: i,
        date: date.format("YYYY-MM-DD"),
        dayName: date.format("ddd").toUpperCase(),
      });
    }
    return days;
  }, [selectedYear, selectedMonth]);

  // Get attendance status for a student on a specific date
  const getAttendanceStatus = (student: any, date: string) => {
    // TODO: Fetch actual attendance data from API
    // For now, return "NA" (Not Available)
    return "NA";
  };

  // Calculate attendance summary for a student
  const getAttendanceSummary = (student: any) => {
    let present = 0;
    let absent = 0;
    
    daysInMonth.forEach((day) => {
      const status = getAttendanceStatus(student, day.date);
      if (status === "Present") present++;
      else if (status === "Absent") absent++;
    });

    return { present, absent };
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return COLORS.graphGreen;
      case "Absent":
        return COLORS.graphRed;
      case "Late":
        return "#FFA500"; // Orange
      case "Weekly Off":
        return "#D3D3D3"; // Light gray
      case "Holiday":
        return "#4169E1"; // Blue
      default:
        return "#E0E0E0"; // Light gray for NA
    }
  };

  // Month names
  const monthNames = moment.months();
  const currentYear = moment().year();
  // Show current year and previous 5 years (total 6 years)
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  
  const monthsMenu = monthNames.map((month, index) => ({
    label: month,
    value: index,
  }));
  
  const yearsMenu = years.map((year) => ({
    label: `${year}`,
    value: year,
  }));

  return (
    <ThemeScrollView paddingHorizontal={15} loading={isLoading}>
        {/* Header */}
        <Flex mt={10} mb={8} flexDirection="column" align="flex-start">
          <ScalableText fontFamily="SemiBold" style={styles.title}>
            Student calendar view
          </ScalableText>
          <ScalableText fontFamily="Regular" style={styles.subtitle}>
            Track daily attendance for each student across the month.
          </ScalableText>
        </Flex>

        {/* Search and Date Selectors */}
        <View style={styles.controlsCard}>
        <Flex
          flexDirection="row"
          justify="space-between"
          align="center"
        >
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Name, ID"
              placeholderTextColor={COLORS.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Flex flexDirection="row" align="center" gap={10}>
            <SelectDropdown
              data={yearsMenu}
              onSelect={(selectedItem) => {
                setSelectedYear(selectedItem.value);
              }}
              renderButton={(selectedItem) => (
                <View style={styles.selectorButton}>
                  <ScalableText fontFamily="Medium" style={styles.selectorText}>
                    {selectedItem?.value || selectedYear}
                  </ScalableText>
                </View>
              )}
              renderItem={(item) => (
                <View style={styles.dropdownItem}>
                  <ScalableText fontFamily="Regular" style={styles.dropdownItemText}>
                    {item.label}
                  </ScalableText>
                </View>
              )}
              dropdownStyle={styles.dropdownStyle}
              defaultButtonText={`${selectedYear}`}
            />
            <SelectDropdown
              data={monthsMenu}
              onSelect={(selectedItem) => {
                setSelectedMonth(selectedItem.value);
              }}
              renderButton={(selectedItem) => (
                <View style={styles.selectorButton}>
                  <ScalableText fontFamily="Medium" style={styles.selectorText}>
                    {selectedItem?.label || monthNames[selectedMonth]}
                  </ScalableText>
                </View>
              )}
              renderItem={(item) => (
                <View style={styles.dropdownItem}>
                  <ScalableText fontFamily="Regular" style={styles.dropdownItemText}>
                    {item.label}
                  </ScalableText>
                </View>
              )}
              dropdownStyle={styles.dropdownStyle}
              defaultButtonText={monthNames[selectedMonth]}
            />
          </Flex>
        </Flex>
        </View>

        {/* Calendar Table */}
        <CustomHorizontalScrollView showScrollbar={true}>
          <View style={styles.tableContainer}>
            <Grid style={{ minWidth: 800 }}>
              {/* Header Row */}
              <Row style={styles.headerRow}>
                <Col style={[styles.headerCell, styles.studentNameCell]}>
                  <ScalableText fontFamily="Medium" style={styles.headerText}>
                    STUDENT NAME
                  </ScalableText>
                </Col>
                <Col style={[styles.headerCell, styles.summaryCell]}>
                  <ScalableText fontFamily="Medium" style={styles.headerText}>
                    ATTENDANCE COUNT
                  </ScalableText>
                </Col>
                {daysInMonth.map((day) => (
                  <Col
                    key={day.date}
                    style={[styles.headerCell, styles.dayCell]}
                  >
                    <ScalableText
                      fontFamily="Medium"
                      style={styles.headerText}
                      numberOfLines={2}
                    >
                      {day.day} {day.dayName}
                    </ScalableText>
                  </Col>
                ))}
              </Row>

              {/* Data Rows */}
              {filteredStudents.map((student: any, index: number) => {
                const summary = getAttendanceSummary(student);
                const studentName = `${student.studentFirstName || ""} ${student.studentLastName || ""}`.trim();

                return (
                  <Row
                    key={student.studentEnrollmentNumber || index}
                    style={[styles.dataRow, index % 2 === 0 && styles.dataRowAlt]}
                  >
                    {/* Student Name */}
                    <Col style={[styles.dataCell, styles.studentNameCell]}>
                      <Flex flexDirection="row" align="center" gap={8}>
                        <Avatar
                          content={studentName || student.studentEnrollmentNumber}
                          size={32}
                        />
                        <Flex flexDirection="column">
                          <ScalableText fontFamily="Regular" style={styles.studentName}>
                            {studentName || "-"}
                          </ScalableText>
                          <ScalableText fontFamily="Regular" style={styles.studentId}>
                            {student.studentEnrollmentNumber || "-"}
                          </ScalableText>
                        </Flex>
                      </Flex>
                    </Col>

                    {/* Summary */}
                    <Col style={[styles.dataCell, styles.summaryCell]}>
                      <Flex flexDirection="column" gap={4}>
                        <ScalableText
                          fontFamily="Regular"
                          style={[styles.summaryText, { color: COLORS.graphGreen }]}
                        >
                          Present: {summary.present}
                        </ScalableText>
                        <ScalableText
                          fontFamily="Regular"
                          style={[styles.summaryText, { color: COLORS.graphRed }]}
                        >
                          Absent: {summary.absent}
                        </ScalableText>
                      </Flex>
                    </Col>

                    {/* Daily Attendance */}
                    {daysInMonth.map((day) => {
                      const status = getAttendanceStatus(student, day.date);
                      return (
                        <Col
                          key={day.date}
                          style={[styles.dataCell, styles.dayCell]}
                        >
                          <View
                            style={[
                              styles.statusIndicator,
                              { backgroundColor: getStatusColor(status) },
                            ]}
                          >
                            <ScalableText
                              fontFamily="Regular"
                              style={styles.statusText}
                            >
                              {status}
                            </ScalableText>
                          </View>
                        </Col>
                      );
                    })}
                  </Row>
                );
              })}
            </Grid>
          </View>
        </CustomHorizontalScrollView>

        {/* Total Students */}
        <Flex mt={15} mb={10}>
          <ScalableText fontFamily="Medium" style={styles.totalText}>
            Total Students: {filteredStudents.length}
          </ScalableText>
        </Flex>

        {/* Legend */}
        <Flex flexDirection="row" flexWrap="wrap" gap={10} mt={15} mb={20}>
          <Flex flexDirection="row" align="center" gap={5}>
            <View
              style={[styles.legendBox, { backgroundColor: COLORS.graphGreen }]}
            />
            <ScalableText fontFamily="Regular" style={styles.legendText}>
              Present
            </ScalableText>
          </Flex>
          <Flex flexDirection="row" align="center" gap={5}>
            <View
              style={[styles.legendBox, { backgroundColor: COLORS.graphRed }]}
            />
            <ScalableText fontFamily="Regular" style={styles.legendText}>
              Absent
            </ScalableText>
          </Flex>
          <Flex flexDirection="row" align="center" gap={5}>
            <View
              style={[styles.legendBox, { backgroundColor: "#FFA500" }]}
            />
            <ScalableText fontFamily="Regular" style={styles.legendText}>
              Late
            </ScalableText>
          </Flex>
          <Flex flexDirection="row" align="center" gap={5}>
            <View
              style={[styles.legendBox, { backgroundColor: "#D3D3D3" }]}
            />
            <ScalableText fontFamily="Regular" style={styles.legendText}>
              Weekly Off
            </ScalableText>
          </Flex>
          <Flex flexDirection="row" align="center" gap={5}>
            <View
              style={[styles.legendBox, { backgroundColor: "#4169E1" }]}
            />
            <ScalableText fontFamily="Regular" style={styles.legendText}>
              Holiday
            </ScalableText>
          </Flex>
          <Flex flexDirection="row" align="center" gap={5}>
            <View
              style={[styles.legendBox, { backgroundColor: "#E0E0E0" }]}
            />
            <ScalableText fontFamily="Regular" style={styles.legendText}>
              Not Available
            </ScalableText>
          </Flex>
        </Flex>
      </ThemeScrollView>
  );
};

export default StudentCalendarView;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  controlsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 4,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectorButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorText: {
    fontSize: 14,
    color: COLORS.black,
  },
  dropdownStyle: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingVertical: 5,
    marginTop: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.black,
  },
  tableContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  headerRow: {
    backgroundColor: COLORS.lighterBlue,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    height: 60,
  },
  headerCell: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  headerText: {
    fontSize: 11,
    color: COLORS.primary,
    textAlign: "center",
  },
  studentNameCell: {
    width: 200,
  },
  summaryCell: {
    width: 150,
  },
  dayCell: {
    width: 80,
  },
  dataRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    minHeight: 60,
  },
  dataRowAlt: {
    backgroundColor: "#F9FBFF",
  },
  dataCell: {
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  studentName: {
    fontSize: 13,
    color: COLORS.black,
  },
  studentId: {
    fontSize: 11,
    color: COLORS.muted,
  },
  summaryText: {
    fontSize: 11,
  },
  statusIndicator: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 24,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.white,
    textAlign: "center",
  },
  totalText: {
    fontSize: 14,
    color: COLORS.black,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.black,
  },
});

