"use client";

import { useState, useCallback } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";

interface CropperModalProps {
  file: File;
  onImageComplete: (croppedFile: File, previewUrl: string) => void;
  cropAspect?: number;
  minimizeMB?: number;
}

export default function ImageCropper({
  file,
  onImageComplete,
  cropAspect = 1,
  minimizeMB = 0.5,
}: CropperModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (): Promise<File | null> => {
    if (!file || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = URL.createObjectURL(file);
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<File | null>((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve(null);

        const croppedFile = new File([blob], file.name || "cropped.jpg", {
          type: blob.type,
        });
        // Compress về ≤ 500kb
        const compressed = await imageCompression(croppedFile, {
          maxSizeMB: minimizeMB,
          useWebWorker: true,
        });
        resolve(compressed);
      }, "image/jpeg");
    });
  };

  const handleConfirm = async () => {
    const cropped = await getCroppedImg();
    if (!cropped) return;

    const previewUrl = URL.createObjectURL(cropped);
    onImageComplete(cropped, previewUrl);
  };

  return (
    <div className="w-lg">
      <div className="relative w-full h-96 bg-black">
        <Cropper
          image={URL.createObjectURL(file)}
          crop={crop}
          zoom={zoom}
          aspect={cropAspect}
          onCropChange={(location: Point) => setCrop(location)}
          onZoomChange={(z: number) => setZoom(z)}
          onCropComplete={onCropComplete}
        />
      </div>
      <Button
        onClick={(e) => {
          e.currentTarget.disabled = true;
          handleConfirm();
        }}
        className="cursor-pointer flex ms-auto my-2 me-2"
      >
        Xác nhận
      </Button>
    </div>
  );
}
