import ProductCategoryGroup from "@/components/features/product/product-category-group";
import ProductShowcase from "@/components/features/product/product-showcase";
import Banner from "@/components/layouts/banner";
import { categoryService } from "@/libs/services/category.service";

export default async function Home() {
  const categories = await categoryService.getCategoryOverview();
  if (!categories) return null;
  return (
    <div>
      <Banner></Banner>
      <ProductShowcase></ProductShowcase>
      {categories.map((lv1, index) => (
        <ProductCategoryGroup
          key={index}
          catergory={lv1}
        ></ProductCategoryGroup>
      ))}
    </div>
  );
}
