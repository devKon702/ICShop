"use client";
import useDebounce from "@/libs/hooks/useDebouce";
import React, { useEffect, useRef, useState } from "react";

type SearchInputProps = {
  className?: string;
  placeholder?: string;
  searchDelay?: number;
};

export default function SearchInput({
  searchDelay = 500,
  placeholder = "Tìm kiếm...",
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const searchDebouce = useDebounce<string>(query, searchDelay);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (!inputRef.current || !popupRef.current) return;

    if (!inputRef.current.contains(e.target as Node)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (searchDebouce.length != 0) setShowPopup(true);
    else setShowPopup(false);
  }, [searchDebouce]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={inputRef}>
      <div className="flex items-center space-x-2 border border-gray-300 rounded-md bg-white overflow-hidden px-3 py-2">
        <i className="bx bx-search-alt text-xl"></i>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none bg-white"
          placeholder={placeholder}
        />
      </div>
      {showPopup && (
        <div
          ref={popupRef}
          className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg border rounded-md z-50 max-h-60 overflow-auto"
        >
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </div>
      )}
    </div>
  );
}
