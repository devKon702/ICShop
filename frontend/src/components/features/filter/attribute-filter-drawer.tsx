import SelectedAttributeValueFilter from "@/components/features/filter/selected-attribute-filter";
import SideAttributeFilter from "@/components/features/filter/side-attribute-filter";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FilterIcon } from "lucide-react";
import React from "react";

interface Props {
  attributes: {
    id: number;
    name: string;
    values: { id: number; value: string }[];
  }[];
}

function AttributeFilterDrawer({ attributes }: Props) {
  return (
    <Drawer direction="left">
      <DrawerTrigger>
        <Button className="md:hidden w-full">
          <FilterIcon /> Lọc
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-1">
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <SelectedAttributeValueFilter />
        <SideAttributeFilter attributes={attributes || []} />
      </DrawerContent>
    </Drawer>
  );
}

export default AttributeFilterDrawer;
