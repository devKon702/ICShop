import apiAxios from "@/libs/api/api-axios";
import { ProductImageBaseSchema } from "@/libs/schemas/product-image.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler } from "@/utils/response-handler";

const galleryService = {
  addImageGallery: async (productId: number, image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("productId", productId.toString());
    return axiosHandler(
      apiAxios.post("/v1/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
      ApiResponseSchema(ProductImageBaseSchema)
    );
  },

  deleteImageGallery: async (imageId: number) =>
    axiosHandler(
      apiAxios.delete("/v1/gallery/" + imageId),
      ApiResponseSchema(ProductImageBaseSchema)
    ),

  updateImageGallery: async (imageId: number, image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    return axiosHandler(
      apiAxios.patch(`/v1/gallery/${imageId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
      ApiResponseSchema(ProductImageBaseSchema)
    );
  },
};

export default galleryService;
