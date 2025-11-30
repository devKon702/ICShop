"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import {} from "@tiptap/extensions";
import Separator from "@/components/common/separator";
import { cn } from "@/utils/className";
import MenuBar from "@/components/common/app-text-editor/menu-bar";

interface Props {
  defaultValue?: string;
  maxLength?: number;
  className?: string;
  onChange?: (value: string) => void;
}

export default function AppTextEditor({
  className,
  defaultValue,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: "list-disc ml-5 mb-2" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal ml-5 mb-2" },
        },
        heading: {
          levels: [1, 2, 3],
        },
        link: {
          openOnClick: true,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https", "mailto"],
          HTMLAttributes: {
            class: "text-blue-600 hover:underline cursor-pointer",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Subscript,
      Superscript,
      TableKit.configure({
        table: {
          resizable: true,
        },
      }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "w-full h-fit min-h-60 focus:outline-none",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });
  return (
    <div
      className={cn("w-full rounded-md p-2 border-2 outline-none", className)}
    >
      <MenuBar editor={editor} />
      <Separator />
      <div className="overflow-y-auto min-h-60 max-h-96 app">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
