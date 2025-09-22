export const vietnameseRegex = (inclueNumber = false) => {
  return inclueNumber ? /^[A-Za-zÀ-ỹ0-9\s]+$/u : /^[A-Za-zÀ-ỹ\s]+$/u;
};

export const emailRegex = () => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
};

export const phoneRegex = () => {
  return /^(?:\+84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9\d)\d{7}$/;
};

export const decimalRegex = (intDigits?: number, fractionDigits?: number) => {
  const intPart = intDigits ? `\\d{1,${intDigits}}` : `\\d+`;

  const fractionPart = fractionDigits
    ? `([.]\\d{0,${fractionDigits}})?`
    : `([.]\\d+)?`;

  const pattern = `^${intPart}${fractionPart}$`;
  return new RegExp(pattern);
};
