import { API_ROUTE } from "@/constants/api-route";
import { Category } from "@/libs/models/category";

const getCategoryOverview = async () => {
  try {
    const res = await fetch(API_ROUTE.category + "/overview").then((res) =>
      res.json()
    );
    return res.data as Category[];
  } catch (e) {
    console.log(e);
  }
};

const getCategoryBySlug = async (slug: string) => {
  try {
    const res = await fetch(API_ROUTE.category + "/" + slug).then((res) =>
      res.json()
    );
    return res.data as Category;
  } catch (e) {
    console.log(e);
  }
};

export const categoryService = { getCategoryOverview, getCategoryBySlug };
