import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <div className="p-2 flex flex-col space-y-2 items-center justify-center font-bold">
      <div className="w-full bg-white p-2 rounded-md shadow-md mb-4 space-y-2">
        <Skeleton className="w-full h-10" />
        <div className="grid grid-cols-5 gap-4">
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
        </div>
      </div>
      <div className="w-full bg-white p-2 rounded-md shadow-md space-y-2">
        <Skeleton className="w-3/4 h-6 " />
        <Skeleton className="w-1/4 h-6" />
        <div className="grid grid-cols-5 gap-4">
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
        </div>
      </div>
    </div>
  );
}
