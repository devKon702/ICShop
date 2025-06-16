import { AttributeValue } from "@/libs/models/attribute-value";
import { Product } from "@/libs/models/product";

export type ProductAttribute = {
  id: string;
  productId: number;
  attributeValueId: string;
  product?: Product;
  attributeValue?: AttributeValue;
};
