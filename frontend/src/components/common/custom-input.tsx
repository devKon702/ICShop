import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/utils/className";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  icon?: React.ReactNode;
  placeholder?: string;
  isError: boolean;
  disable?: boolean;
  iconAlign?: "start" | "end";
  min?: string;
  max?: string;
}

export default function CustomInput({
  className,
  type,
  icon,
  placeholder,
  isError,
  disable = false,
  iconAlign = "start",
  min,
  max,
  ...otherProps
}: InputProps) {
  const [hide, setHide] = React.useState(type === "password");
  return (
    <InputGroup
      className={`w-full flex items-center border-2 rounded-sm overflow-hidden ${
        isError && "border-red-400"
      }`}
    >
      <InputGroupAddon align={"inline-start"} className="p-0">
        {iconAlign === "start" && icon}
      </InputGroupAddon>
      <InputGroupInput
        type={type === "password" ? (hide ? "password" : "text") : type}
        className={cn(
          "inline-block outline-none border-none flex-1 p-2 w-full",
          className,
        )}
        placeholder={placeholder}
        disabled={disable}
        min={min}
        max={max}
        {...otherProps}
      />
      {type === "password" ? (
        <InputGroupAddon
          align={"inline-end"}
          onClick={() => setHide(!hide)}
          className="cursor-pointer"
        >
          {hide ? <EyeClosedIcon /> : <EyeIcon />}
        </InputGroupAddon>
      ) : (
        iconAlign === "end" && (
          <InputGroupAddon align={"inline-end"} className="p-0">
            {icon}
          </InputGroupAddon>
        )
      )}
      {isError && <i className="bx bx-error-circle text-red-400 ml-2 px-2"></i>}
    </InputGroup>
  );
}
