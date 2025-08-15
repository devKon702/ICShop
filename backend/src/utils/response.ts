export function successResponse(
  code: string,
  message: string,
  data?: any,
  pagination?: { total: number; page: number; limit: number }
) {
  return pagination
    ? { code, message, data: { result: data, ...pagination } }
    : { code, message, data };
}

export function failResponse(code: string, message: string) {
  return { code, message, data: null };
}
