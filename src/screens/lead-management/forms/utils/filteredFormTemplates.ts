export const filteredFormTemplates = (
  data: TFormLists[],
  filters: {
    search: string;
  }
) => {
  const { search } = filters;

  return data.filter((student) => {
    const matchesSearch =
      !search ||
      student.formTitle.toLowerCase().includes(search.toLowerCase()) ||
      student.formTemplateId.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });
};
