"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ROUTE } from "@/constants/routes";
import categoryService from "@/libs/services/category.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";

export default function CategoryBar() {
  const { data } = useQuery({
    queryKey: ["categoryTree"],
    queryFn: () => categoryService.getTree(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!data) return null;
  return (
    <ul className="flex flex-wrap justify-center space-x-1 py-2 bg-white shadow-md">
      {data.data.map((item, idx) => (
        <Popover
          key={item.id}
          open={openIndex === idx}
          onOpenChange={(open) => setOpenIndex(open ? idx : null)}
        >
          <PopoverTrigger className="flex flex-col items-center justify-between border-b-2 border-transparent hover:border-b-primary cursor-pointer p-1 flex-1 min-w-36 m-0">
            <p className="uppercase text-sm">{item.name}</p>
          </PopoverTrigger>
          <PopoverContent className="w-fit mx-3">
            <ul
              className={`grid ${
                (item.children?.length as number) < 4
                  ? "grid-cols-" + item.children?.length
                  : "grid-cols-4"
              } space-x-8 space-y-2 list-none`}
            >
              {item.children.map((lv2) => (
                <div key={lv2.id} className="flex flex-col border-l-2 px-2">
                  <Link
                    href={`${ROUTE.category}/${lv2.slug}`}
                    className="cursor-pointer text-primary font-medium pointer-events-none"
                    onClick={() => setOpenIndex(null)}
                  >
                    {lv2.name}
                  </Link>
                  <ul>
                    {lv2.children.map((lv3) => (
                      <li key={lv3.id}>
                        <Link
                          href={`${ROUTE.category}/${lv3.slug}`}
                          className="text-sm hover:text-primary cursor-pointer py-1"
                          onClick={() => setOpenIndex(null)}
                        >
                          {lv3.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      ))}
    </ul>
  );
}
