import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ROUTE } from "@/constants/routes";
import { Category } from "@/libs/models/category";
import { HoverCard } from "@radix-ui/react-hover-card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoryBarProps {
  categories: Category[];
}

export default function CategoryBar({
  categories: catergories,
}: CategoryBarProps) {
  return (
    <ul className="flex flex-wrap justify-center space-x-1 py-2 bg-white">
      {catergories.map((item) => (
        <HoverCard key={item.id} openDelay={0} closeDelay={20}>
          <HoverCardTrigger className="flex flex-col items-center justify-between border-b-2 border-transparent hover:border-b-primary cursor-pointer p-1 flex-1 min-w-36 m-0">
            <Image
              src={`/uploads/${item.imageUrl}`}
              width={20}
              height={20}
              alt={item.name}
            ></Image>
            <p className="uppercase text-sm">{item.name}</p>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit mx-3">
            <ul
              className={`grid ${
                (item.children?.length as number) < 4
                  ? "grid-cols-" + item.children?.length
                  : "grid-cols-4"
              } space-x-8 space-y-2 list-none`}
            >
              {!!item.children
                ? item.children.map((lv2) => (
                    <div key={lv2.id} className="flex flex-col border-l-2 px-2">
                      <Link
                        href={`${ROUTE.category}/${lv2.slug}`}
                        className="cursor-pointer text-primary font-medium"
                      >
                        {lv2.name}
                      </Link>
                      <ul>
                        {!!lv2.children
                          ? lv2.children.map((lv3) => (
                              <li key={lv3.id}>
                                <Link
                                  href={`${ROUTE.category}/${lv3.slug}`}
                                  className="text-sm hover:text-primary cursor-pointer py-1"
                                >
                                  {lv3.name}
                                </Link>
                              </li>
                            ))
                          : null}
                      </ul>
                    </div>
                  ))
                : null}
            </ul>
          </HoverCardContent>
        </HoverCard>
      ))}
    </ul>
  );
}
