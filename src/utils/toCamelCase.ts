/* eslint-disable @typescript-eslint/no-explicit-any */
export const toCamelCase = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
};

export const toStringAllValues = (objectData: any) => {
  return Object.keys(objectData).reduce((acc: any, key) => {
    acc[`${key}`] = objectData[key].toString();
    return acc;
  }, {});
};
