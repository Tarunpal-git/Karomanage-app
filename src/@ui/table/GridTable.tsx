import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { SCREEN_WIDTH } from "../../constants/Screen";
import { COLORS } from "../../colors";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../scalable-text/ScalableText";
import Center from "../center/Center";
import Flex from "../flex/Flex";
import { TTableColumns } from "../../types/table/tableColomuns";
import CustomHorizontalScrollView from "../custom-horizontal-scrollview/CustomHorizontalScrollView";
import Pagination from "./components/Pagination";

type IGridTable<T> = {
  data: T[];
  columns: TTableColumns<T>[];
  isLoading: boolean;
  headerHeight?: number;
  columnHeight?: number;
  handleRowClick?: (data?: T) => void;
  headerTextStyles?: TextStyle;
  headerStyles?: ViewStyle;
  fixedFirstElement?: boolean;
  tableContainer?: ViewStyle;
  showScroll?: boolean;
  showHeaders?: boolean;
  itemsPerPage?: number;
};

const GridTable: React.FC<IGridTable<unknown>> = <T,>({
  data,
  columns,
  isLoading,
  columnHeight = 60,
  headerHeight = 60,
  handleRowClick,
  headerTextStyles,
  fixedFirstElement,
  tableContainer,
  showScroll = true,
  headerStyles,
  showHeaders = true,
  itemsPerPage = 10,
}: IGridTable<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const renderSafeValue = (value: any) => {
    if (value === null || value === undefined) return "-";
  
    if (typeof value === "string" || typeof value === "number") {
      return value.toString();
    }
  
    if (Array.isArray(value)) {
      return value.length ? `${value.length} items` : "-";
    }
  
    if (typeof value === "object") {
      return "-"; // or JSON.stringify(value) if needed
    }
  
    return "-";
  };
  
console.log(data,"dataandcolumns",columns)
  return (
    <View style={{ ...styles.tableContainer, ...tableContainer }}>
      <CustomHorizontalScrollView showScrollbar={showScroll}>
        <Grid style={{ minWidth: SCREEN_WIDTH - 50 }}>
          {showHeaders && (
            <Row
              style={{
                ...styles.headerRow,
                height: headerHeight,

                ...headerStyles,
              }}
            >
              {columns.map((header, index) => (
                <Col
                  key={`tableHeader_${index}`}
                  style={{
                    ...styles.headerCell,
                    ...header.headerCellStyle,
                    width: header.minWidth,
                    opacity: header.hidden ? 0 : 1,
                    pointerEvents: header.hidden ? "none" : "auto",
                  }}
                >
                  {header.renderHeader ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    header.renderHeader(header.label as any)
                  ) : (
                    <ScalableText
                      fontFamily="Medium"
                      style={{
                        ...styles.headerText,
                        ...headerTextStyles,
                        ...header.headerTextStyles,
                      }}
                    >
                      {header.label}
                    </ScalableText>
                  )}
                </Col>
              ))}
            </Row>
          )}

          {!isLoading && currentData.length === 0 && (
            <Flex
              styles={{ minHeight: 200 }}
              flexDirection="column"
              justify="center"
              align="flex-start"
              flex={1}
              my={10}
              ml={fixedFirstElement ? 150 : 110}
            >
              <ScalableText fontFamily="Medium">No Data Found</ScalableText>
            </Flex>
          )}
          {isLoading && (
            <Center styles={{ minHeight: 200 }}>
              <ActivityIndicator size={25} color={COLORS.primary} />
            </Center>
          )}

          <Flex flexDirection="column" align="flex-start">
            {!isLoading &&
              currentData.length > 0 &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              currentData.map((item: any, index) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={`${index}_table`}
                  disabled={!handleRowClick}
                  onPress={() => handleRowClick?.(item)}
                >
                  <Row
                    style={{
                      ...styles.headerRow,
                      height: columnHeight,
                    }}
                  >
                    {columns.map((column, index) => (
                      <Col
                        key={`${column.key}_${index}`}
                        style={{
                          ...styles.headerCell,
                          ...column.dataCellStyle,
                          width: column.minWidth,
                          opacity: column.hidden ? 0 : 1,
                          pointerEvents: column.hidden ? "none" : "auto",
                        }}
                      >
                        {column.renderCell ? (
                          column.renderCell(item)
                        ) : (
                          <ScalableText fontFamily="Regular" style={styles.columnsText}>
  {renderSafeValue(item?.[column.key])}
</ScalableText>
                        )}
                      </Col>
                    ))}
                  </Row>
                </TouchableOpacity>
              ))}
          </Flex>
        </Grid>
      </CustomHorizontalScrollView>
      {fixedFirstElement && (
        <View
          style={{
            ...styles.fixedContainer,
            width: columns[0].minWidth,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        >
          <Grid>
            <Row
              style={{
                ...styles.headerRow,
                height: headerHeight,
                ...headerStyles,
              }}
            >
              <Col
                style={{
                  ...styles.headerCell,
                  ...columns[0].headerCellStyle,
                  width: columns[0].minWidth,
                }}
              >
                <ScalableText
                  fontFamily="Medium"
                  style={{
                    ...styles.headerText,
                    ...headerTextStyles,
                  }}
                >
                  {columns[0].label}
                </ScalableText>
              </Col>
            </Row>

            <Flex flexDirection="column" align="flex-start">
              {!isLoading &&
                currentData.length > 0 &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                currentData.map((item: any, index) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0}
                      key={`0_` + index}
                      disabled={!handleRowClick}
                      onPress={() => handleRowClick?.(item)}
                    >
                      <Row
                        style={{
                          ...styles.headerRow,
                          height: columnHeight,
                        }}
                      >
                        <Col
                          style={{
                            ...styles.headerCell,
                            ...columns[0].dataCellStyle,
                            width: columns[0].minWidth,
                          }}
                        >
                          {columns[0].renderCell ? (
                            columns[0].renderCell(item)
                          ) : (
                            <ScalableText
                              fontFamily="Regular"
                              style={styles.columnsText}
                            >
                              {renderSafeValue(item[columns[0].key])}
                            </ScalableText>
                          )}
                        </Col>
                      </Row>
                    </TouchableOpacity>
                  );
                })}
            </Flex>
          </Grid>
        </View>
      )}
      <Pagination
        currentDataCount={currentData?.length ?? 0}
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        totalPages={totalPages}
      />
    </View>
  );
};

export default GridTable;

const styles = StyleSheet.create({
  tableContainer: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.5,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    minHeight: 450,
    marginTop: 5,
    overflow: "hidden",
  },
  headerRow: {
    borderBottomWidth: 0.8,
    borderColor: "#D1D1D1",
    height: 60,
  },
  headerCell: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    color: COLORS.primary,
    fontSize: 14,
    flexWrap: "wrap",
  },
  columnsText: {
    fontSize: 12,
  },
  tableSeparator: {
    height: 8,
    backgroundColor: "#ADA8A8",
    width: 40,
    borderRadius: 10,
  },
  fixedContainer: {
    position: "absolute",
    backgroundColor: COLORS.white,
    top: 0,
    bottom: 0,
    left: 0,
  },
});
