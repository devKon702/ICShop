export const getIdFromString = (str: string | null) => {
  return str ? str.split(",").map((id) => Number(id.trim())) : [];
};
