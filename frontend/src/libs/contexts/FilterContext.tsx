// context/FilterContext.tsx
"use client";

import { AttributeValue } from "@/libs/models/attribute-value";
import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
  selectedAttributeValues: AttributeValue[];
  setSelectedAttributeValues: (ids: AttributeValue[]) => void;
  toggleAttributeValues: (attributeValue: AttributeValue) => void;
  resetAttributeValues: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAttributes, setSelectedAttributes] = useState<
    AttributeValue[]
  >([]);

  const toggleAttribute = (attributeValue: AttributeValue) => {
    setSelectedAttributes((prev) => {
      const index = prev.findIndex((value) => value.id == attributeValue.id);
      if (index == -1) return [...prev, attributeValue];
      else return prev.filter((value) => value.id !== attributeValue.id);
    });
  };

  const resetAttributes = () => setSelectedAttributes([]);

  return (
    <FilterContext.Provider
      value={{
        selectedAttributeValues: selectedAttributes,
        setSelectedAttributeValues: setSelectedAttributes,
        toggleAttributeValues: toggleAttribute,
        resetAttributeValues: resetAttributes,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context)
    throw new Error("useFilterContext must be used within FilterProvider");
  return context;
};
