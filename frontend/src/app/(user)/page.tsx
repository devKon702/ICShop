// import ProductCategoryGroup from "@/components/features/product/product-category-group";
// import ProductShowcase from "@/components/features/product/product-showcase";
import SetBreadCrump from "@/components/common/set-breadcrump";
import Banner from "@/components/layouts/banner";
// import categoryService from "@/libs/services/category.service";

export default async function Home() {
  return (
    <div>
      <SetBreadCrump breadcrumps={[]}></SetBreadCrump>
      <Banner></Banner>
      {/* <ProductShowcase></ProductShowcase>
      {categories.map((lv1, index) => (
        <ProductCategoryGroup
          key={index}
          catergory={lv1}
        ></ProductCategoryGroup>
      ))} */}
    </div>
  );
}
