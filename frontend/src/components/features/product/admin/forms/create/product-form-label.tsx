import { FormLabel } from "@/components/ui/form";

export default function ProductFormLabel({ children }: { children: string }) {
  return <FormLabel className="opacity-50  mt-2">{children}</FormLabel>;
}
