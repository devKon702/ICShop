export const vietnameseRegex = () => {
  return /^[A-Za-zÀ-ỹ\s]+$/u;
};

export const emailRegex = () => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
};
