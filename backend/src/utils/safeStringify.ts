export const safeStringify = (obj: any) =>
  JSON.stringify(obj, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
