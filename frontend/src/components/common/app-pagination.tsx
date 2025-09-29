"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { parseAsInteger, useQueryStates } from "nuqs";

interface Props {
  currentPage: number;
  totalPage: number;
}

export default function AppPagination({ currentPage, totalPage }: Props) {
  const [query, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
  });

  const generatePages = () => {
    const pages: (number | "...")[] = [];

    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPage);
      } else if (currentPage >= totalPage - 2) {
        pages.push(1, "...", totalPage - 2, totalPage - 1, totalPage);
      } else {
        pages.push(1, "...", currentPage, "...", totalPage);
      }
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              currentPage > 1 &&
              setQuery({ ...query, page: Math.max(currentPage - 1, 1) })
            }
          />
        </PaginationItem>

        {generatePages().map((item, idx) => (
          <PaginationItem key={idx}>
            {item === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                className="cursor-pointer data-[active=true]:bg-white hover:bg-white"
                isActive={item === currentPage}
                onClick={() =>
                  item !== currentPage
                    ? setQuery({ ...query, page: item })
                    : null
                }
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() =>
              currentPage < totalPage &&
              setQuery({ ...query, page: currentPage + 1 })
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
