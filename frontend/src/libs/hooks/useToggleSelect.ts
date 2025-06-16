import React from "react";

type EqualFn<T> = (a: T, b: T) => boolean;

export function useToggleSelect<T>(
  initalArray: T[],
  equalFn: EqualFn<T>
): [T[], (item: T) => void] {
  const [currentItems, setCurrentItems] = React.useState(initalArray);

  const toggle = function (item: T) {
    const index = currentItems.findIndex((i) => equalFn(i, item));
    if (index == -1) {
      currentItems.push(item);
    } else {
      currentItems.splice(index, 1);
    }
    setCurrentItems([...currentItems]);
    console.log(currentItems);
  };
  return [currentItems, toggle];
}
