import { useModalActions } from "@/store/modal-store";
import { ImagePlus, Images, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageSection({
  onPosterChange,
  onGalleryChange,
}: {
  onPosterChange: (file: File) => void;
  onGalleryChange: (files: File[]) => void;
}) {
  const { openModal, closeModal } = useModalActions();
  const [poster, setPoster] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    onGalleryChange(galleryFiles);
  }, [galleryFiles, onGalleryChange]);

  return (
    <section className="p-3 bg-white rounded-lg mb-2 shadow">
      <p className="font-semibold flex space-x-1 mb-3">
        <Images /> <span>Ảnh</span>
      </p>
      <div className="flex space-x-4">
        <div>
          <label
            htmlFor="poster"
            className="relative flex rounded-md border-1 size-44 cursor-pointer items-center justify-center space-x-2 bg-primary-light text-primary overflow-hidden"
          >
            {poster ? (
              <Image
                src={poster}
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
                    onImageComplete: (file, previewUrl) => {
                      setPoster(previewUrl);
                      onPosterChange(file);
                      closeModal();
                    },
                  },
                });
              }
            }}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {gallery.map((item, index) => (
            <div key={index}>
              <label
                htmlFor={`gallery-${index}`}
                className="relative flex rounded-md border-1 size-20 cursor-pointer items-center justify-center space-x-2 bg-primary-light text-primary"
              >
                <ImagePlus />
                <Image
                  src={item}
                  width={100}
                  height={100}
                  alt="Gallery item"
                  className="absolute rounded-md inset-0"
                />
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
                        onImageComplete: (file, previewUrl) => {
                          gallery.splice(index, 1, previewUrl);
                          galleryFiles.splice(index, 1, file);
                          setGallery([...gallery]);
                          setGalleryFiles([...galleryFiles]);
                          closeModal();
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
                      onImageComplete: (file, previewUrl) => {
                        setGallery([...gallery, previewUrl]);
                        setGalleryFiles([...galleryFiles, file]);
                        closeModal();
                      },
                    },
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
