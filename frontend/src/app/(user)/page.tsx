import SetBreadCrump from "@/components/common/set-breadcrump";
import CollectionCarousel from "@/components/features/collection/collection-carousel";
import ProductHighlightTabs from "@/components/features/product/user/product-highlight-tab";
import Banner from "@/components/layouts/banner";
import collectionService from "@/libs/services/collection.service";
import highlightService from "@/libs/services/highlight.service";
import tryCatch from "@/utils/try-catch";

export default async function Home() {
  const [collections] = await tryCatch(collectionService.user.getAll());
  const [highlightedProducts] = await tryCatch(highlightService.user.getAll());
  return (
    <div>
      <SetBreadCrump breadcrumps={[]}></SetBreadCrump>
      <Banner></Banner>
      <section className="flex flex-col gap-4 my-6">
        {highlightedProducts && (
          <ProductHighlightTabs
            data={highlightedProducts?.data.map((item) => ({
              highlightType: item.type,
              products: item.list.map(({ product }) => ({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                posterUrl: product.posterUrl ?? null,
                slug: product.slug,
              })),
            }))}
          />
        )}
        {collections?.data.map((collection) => (
          <CollectionCarousel
            key={collection.id}
            collection={{
              id: collection.id,
              name: collection.name,
              desc: collection.desc,
              slug: collection.slug,
              products: collection.productCollections.map((item) => ({
                id: item.product.id,
                name: item.product.name,
                price: Number(item.product.price),
                posterUrl: item.product.posterUrl ?? null,
                slug: item.product.slug,
              })),
            }}
          />
        ))}
      </section>
    </div>
  );
}
