import { parse } from "react-native-redash";
export const getPathXCenter = (currentPath: string) => {
  const parsedPath = parse(currentPath); //updated
  if (!parsedPath || !parsedPath.curves) return 0; // Or any default value - updated
  const curves = parse(currentPath).curves;
  const startPoint = curves[0].to;
  const endPoint = curves[curves.length - 1].to;
  const centerX = (startPoint.x + endPoint.x) / 2;
  return centerX;
};
export const getPathXCenterByIndex = (tabPaths: any[], index: number) => {
  const path = tabPaths[index];//updated
  if (!path || !path.curves) return 0; // Or any default value - updated
  const curves = tabPaths[index].curves;
  const startPoint = curves[0].to;
  const endPoint = curves[curves.length - 1].to;
  const centerX = (startPoint.x + endPoint.x) / 2;
  return centerX;
};