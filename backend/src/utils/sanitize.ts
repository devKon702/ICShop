import { Decimal } from "@prisma/client/runtime/library";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "p",
      "ul",
      "ol",
      "li",
      "a",
      "br",
      "h1",
      "h2",
      "h3",
    ],
    ALLOWED_ATTR: ["href", "target"],
  });
}

export function sanitizeData<T>(
  data: T,
  options: { useDefault?: boolean; removeFields: string[] } = {
    useDefault: true,
    removeFields: [],
  }
): Partial<T> {
  const defaultFields = options.useDefault
    ? [
        "creator",
        "creatorId",
        "modifier",
        "modifierId",
        "version",
        "createdAt",
        "updatedAt",
      ]
    : [];

  const sensitiveFields = [
    ...new Set([...defaultFields, ...options.removeFields]),
  ] as const;

  function handle(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => handle(item));
    }
    if (value instanceof Date) {
      // preserve Date objects (copy to avoid mutation)
      return new Date(value.getTime());
    }
    // preserve Decimal objects
    if (value instanceof Decimal) {
      return value;
    }

    if (value && typeof value === "object") {
      const result: any = {};
      for (const [key, val] of Object.entries(value)) {
        if (!sensitiveFields.includes(key)) {
          result[key] = handle(val);
        }
      }
      return result;
    }
    return value;
  }
  return handle(data);
}
