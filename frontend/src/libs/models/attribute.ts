import { AttributeValue } from "@/libs/models/attribute-value";
import { Category } from "@/libs/models/category";

export type Attribute = {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
  values?: AttributeValue[];
};
