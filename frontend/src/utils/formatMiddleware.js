export const formatLegalAdvice = (data) => {
    return data.map((item) => ({
      title: item.title.toUpperCase(),
      description: item.description.toUpperCase(),
    }));
  };
  