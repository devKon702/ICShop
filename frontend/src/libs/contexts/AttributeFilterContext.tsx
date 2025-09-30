"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AttributeValueType = {
  id: number;
  value: string;
  attributeId: number;
};

interface AttributeFilterContextType {
  selectedAttributeValues: AttributeValueType[];
  setSelectedAttributeValues: (ids: AttributeValueType[]) => void;
  toggleAttributeValues: (attributeValue: AttributeValueType) => void;
  resetAttributeValues: () => void;
}

const AttributeFilterContext = createContext<
  AttributeFilterContextType | undefined
>(undefined);

export const AttributeFilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<
    AttributeValueType[]
  >([]);

  const toggleAttribute = (attributeValue: AttributeValueType) => {
    setSelectedAttributes((prev) => {
      const index = prev.findIndex((value) => value.id == attributeValue.id);
      if (index == -1) return [...prev, attributeValue];
      else return prev.filter((value) => value.id !== attributeValue.id);
    });
  };

  const resetAttributes = () => setSelectedAttributes([]);

  return (
    <AttributeFilterContext.Provider
      value={{
        selectedAttributeValues: selectedAttributes,
        setSelectedAttributeValues: setSelectedAttributes,
        toggleAttributeValues: toggleAttribute,
        resetAttributeValues: resetAttributes,
      }}
    >
      {children}
    </AttributeFilterContext.Provider>
  );
};

export const useAttributeFilterContext = () => {
  const context = useContext(AttributeFilterContext);
  if (!context)
    throw new Error(
      "useAttributeFilterContext must be used within AttributeFilterProvider"
    );
  return context;
};
