export function createFormData(data: object) {
  const entries = Object.entries(data);
  const formData = new FormData();
  entries.forEach((item) => formData.append(item[0], item[1]));
  return formData;
}
