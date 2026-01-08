export const isEmptyString = (text: unknown): string => {

  if (typeof text !== "string" || text.trim() === "") {
    return "-";
  }
  return text;
};