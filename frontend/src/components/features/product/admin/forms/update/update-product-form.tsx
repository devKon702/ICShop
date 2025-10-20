import React from "react";

interface Props {
  productId: number;
  onSuccess?: () => void;
}

export default function UpdateProductForm({ productId, onSuccess }: Props) {
  return <div>UpdateProductForm</div>;
}
