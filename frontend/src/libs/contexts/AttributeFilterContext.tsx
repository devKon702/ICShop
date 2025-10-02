"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AttributeValueType = {
  id: number;
  value: string;
  attribute: { id: number; name: string };
};

interface AttributeFilterContextType {
  selectedAttributeValues: AttributeValueType[];
  setSelectedAttributeValues: (attributeValues: AttributeValueType[]) => void;
  toggleAttributeValues: (attributeValue: AttributeValueType) => void;
  resetAttributeValues: () => void;
  changed: boolean;
  setChanged: (changed: boolean) => void;
}

const AttributeFilterContext = createContext<
  AttributeFilterContextType | undefined
>(undefined);

export const AttributeFilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [changed, setChanged] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<
    AttributeValueType[]
  >([]);

  const toggleAttribute = (attributeValue: AttributeValueType) => {
    setChanged(true);
    setSelectedAttributes((prev) => {
      const index = prev.findIndex((value) => value.id == attributeValue.id);
      if (index == -1) return [...prev, attributeValue];
      else return prev.filter((value) => value.id !== attributeValue.id);
    });
  };

  const resetAttributes = () => {
    setSelectedAttributes([]);
    setChanged(true);
  };

  return (
    <AttributeFilterContext.Provider
      value={{
        selectedAttributeValues: selectedAttributes,
        setSelectedAttributeValues: setSelectedAttributes,
        toggleAttributeValues: toggleAttribute,
        resetAttributeValues: resetAttributes,
        changed,
        setChanged,
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
