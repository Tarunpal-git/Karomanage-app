export const getFirstCharactersOfWords = (
  str: string | undefined | null,
  wordCount: number = 2
) => {
  if (typeof str === "string" && str.length > 0) {
    const words = str.split(" "); // split the string into words
    let result = "";

    for (let i = 0; i < Math.min(wordCount, words.length); i++) {
      if (words[i].length > 0) {
        result += words[i].charAt(0); // get the first character of each word
      }
    }

    return result;
  }

  return "X";
};
