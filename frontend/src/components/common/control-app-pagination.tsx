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

interface Props {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export default function ControlAppPagination({
  currentPage,
  totalPage,
  onPageChange,
}: Props) {
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
            onClick={() => {
              if (currentPage <= 1) return;
              onPageChange(currentPage - 1);
            }}
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
                onClick={() => {
                  if (item === currentPage) return;
                  onPageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => {
              if (currentPage >= totalPage) return;
              onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
