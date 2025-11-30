import { cn } from "@/utils/className";
import { Editor } from "@tiptap/react";
import React from "react";

export default function EditorButton({
  editor,
  content,
  onClick,
  checkActive,
  title,
  checkDisabled,
  className,
}: {
  editor: Editor | null;
  content: React.ReactNode;
  onClick: () => void;
  checkDisabled?: () => boolean;
  checkActive: () => boolean;
  title?: string;
  className?: string;
}) {
  const [active, setActive] = React.useState(checkActive());
  const [disabled, setDisabled] = React.useState(!!checkDisabled?.());
  React.useEffect(() => {
    if (!editor) return;

    const update = () => {
      setActive(checkActive());
      setDisabled(!!checkDisabled?.());
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor, checkActive, checkDisabled]);
  if (!editor) return null;
  return (
    <div
      onClick={() => {
        onClick();
      }}
      data-disabled={disabled}
      data-state={active}
      className={cn(
        "data-[state=true]:text-white data-[state=true]:bg-primary cursor-pointer transition-all duration-200 rounded-md p-2 hover:bg-primary/10 data-[disabled=true]:opacity-20 data-[disabled=true]:cursor-default data-[disabled=true]:pointer-events-none",
        className
      )}
      title={title}
    >
      {content}
    </div>
  );
}
