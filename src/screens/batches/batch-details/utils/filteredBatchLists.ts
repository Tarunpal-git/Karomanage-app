export const filteredBatchLists = (
  data: TBatchData[],
  filters: {
    search: string;
  }
) => {
  const { search } = filters;

  return data.filter((batch) => {
    const matchesSearch =
      !search || batch.batchName.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });
};
