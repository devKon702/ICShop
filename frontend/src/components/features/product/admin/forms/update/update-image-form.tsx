import SafeImage from "@/components/common/safe-image";
import env from "@/constants/env";
import galleryService from "@/libs/services/gallery.service";
import productService from "@/libs/services/product.service";
import { useModalActions } from "@/store/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Images, Upload, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  productId: number;
  posterUrl: string | null;
  gallery: { id: number; url: string }[];
}

export default function UpdateImageForm({
  productId,
  posterUrl,
  gallery,
}: Props) {
  const { openModal, closeModal } = useModalActions();
  const [poster, setPoster] = useState<string | null>(posterUrl);
  const [galleryItems, setGalleryItems] =
    useState<{ id: number; url: string }[]>(gallery);

  const queryClient = useQueryClient();

  const { mutate: addImageMutate } = useMutation({
    mutationFn: async (data: { productId: number; file: File }) =>
      galleryService.addImageGallery(data.productId, data.file),
    onSuccess: (data) => {
      setGalleryItems([
        ...galleryItems,
        { id: data.data.id, url: data.data.imageUrl },
      ]);
      queryClient.invalidateQueries({
        queryKey: ["product", { id: productId }],
      });
      toast.success("Thêm ảnh thành công");
    },
    onError: () => {
      toast.error("Thêm ảnh thất bại, vui lòng thử lại");
    },
  });
  const { mutate: deleteImageMutate } = useMutation({
    mutationFn: async (data: { productId: number; imageId: number }) =>
      galleryService.deleteImageGallery(data.imageId),
    onSuccess: (data) => {
      setGalleryItems((prev) =>
        prev.filter((item) => item.id !== data.data.id)
      );
      queryClient.invalidateQueries({
        queryKey: ["product", { id: productId }],
      });
      toast.success("Xoá ảnh thành công");
    },
    onError: () => {
      toast.error("Xoá ảnh thất bại, vui lòng thử lại");
    },
  });
  const { mutate: updateImageMutate } = useMutation({
    mutationFn: async (data: {
      productId: number;
      imageId: number;
      file: File;
    }) => galleryService.updateImageGallery(data.imageId, data.file),
    onSuccess: (data) => {
      setGalleryItems((prev) =>
        prev.map((item) =>
          item.id === data.data.id
            ? { id: data.data.id, url: data.data.imageUrl }
            : item
        )
      );
      queryClient.invalidateQueries({
        queryKey: ["product", { id: productId }],
      });
      toast.success("Cập nhật ảnh thành công");
    },
  });
  const { mutate: updatePosterMutate } = useMutation({
    mutationFn: async (file: File) =>
      productService.admin.updatePoster(productId, file),
    onSuccess: (data) => {
      setPoster(data.data.posterUrl || null);
      queryClient.invalidateQueries({
        queryKey: ["product", { id: productId }],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Cập nhật poster thành công");
    },
    onError: () => {
      toast.error("Cập nhật poster thất bại, vui lòng thử lại");
    },
  });
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <p className="font-semibold flex space-x-1 mb-3">
        <Images /> <span>Ảnh</span>
      </p>
      <div className="flex space-x-4">
        <div className="relative">
          <label
            htmlFor="poster"
            className="relative flex rounded-md border-1 size-44 cursor-pointer items-center justify-center space-x-2 bg-primary-light text-primary overflow-hidden"
          >
            {poster ? (
              <SafeImage
                key={poster}
                src={env.NEXT_PUBLIC_FILE_URL + "/" + poster}
                width={200}
                height={200}
                alt="Poster"
                className="absolute rounded-md inset-0"
              />
            ) : (
              <>
                <Upload /> <span className="font-semibold">Tải ảnh</span>
              </>
            )}
          </label>
          <input
            id="poster"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.currentTarget.files?.length) {
                openModal({
                  type: "imageCropper",
                  props: {
                    file: e.currentTarget.files[0],
                    onImageComplete: (file) => {
                      if (
                        confirm("Bạn có chắc muốn cập nhật ảnh đại diện không?")
                      ) {
                        updatePosterMutate(file);
                        // setPoster(previewUrl);
                        closeModal();
                      }
                    },
                  },
                });
              }
            }}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <div key={index}>
              <label
                htmlFor={`gallery-${index}`}
                className="relative flex rounded-md border-1 size-20 cursor-pointer items-center justify-center space-x-2 bg-primary-light text-primary"
              >
                <ImagePlus />
                {item.url && (
                  <>
                    <SafeImage
                      key={item.url}
                      src={`${env.NEXT_PUBLIC_FILE_URL}/${item.url}`}
                      width={100}
                      height={100}
                      alt="Gallery item"
                      className="absolute rounded-md inset-0"
                    />
                    <div
                      className="rounded-full p-1 absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 not-hover:opacity-70 bg-red-100 cursor-pointer shadow-lg text-red-400"
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm("Bạn có chắc muốn xoá ảnh này không?")) {
                          deleteImageMutate({ productId, imageId: item.id });
                        }
                      }}
                    >
                      <X />
                    </div>
                  </>
                )}
              </label>
              <input
                id={`gallery-${index}`}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.currentTarget.files?.length) {
                    openModal({
                      type: "imageCropper",
                      props: {
                        file: e.currentTarget.files[0],
                        onImageComplete: (file) => {
                          if (
                            confirm("Bạn có chắc muốn cập nhật ảnh này không?")
                          ) {
                            closeModal();
                            updateImageMutate({
                              productId,
                              imageId: item.id,
                              file,
                            });
                          }
                        },
                      },
                    });
                  }
                }}
              />
            </div>
          ))}
          <div>
            <label
              htmlFor={`gallery`}
              className="relative flex rounded-md border-1 size-20 cursor-pointer items-center justify-center space-x-2 bg-primary-light text-primary"
            >
              <ImagePlus />
            </label>
            <input
              id={`gallery`}
              type="file"
              accept="image/*"
              hidden
              multiple={true}
              onChange={(e) => {
                if (e.currentTarget.files?.length) {
                  openModal({
                    type: "imageCropper",
                    props: {
                      file: e.currentTarget.files[0],
                      onImageComplete: (file) => {
                        if (
                          confirm("Bạn có chắc muốn cập nhật ảnh này không?")
                        ) {
                          addImageMutate({ productId, file });
                          closeModal();
                        }
                      },
                    },
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
