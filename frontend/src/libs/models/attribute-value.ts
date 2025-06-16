import { Attribute } from "@/libs/models/attribute";
import { ProductAttribute } from "@/libs/models/product-attribute";

export type AttributeValue = {
  id: string;
  attributeId: number;
  value: string;
  attribute?: Attribute;
  products?: ProductAttribute[];
};
