"use client";
import React from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {} from "@tiptap/extensions";
import {
  BoldIcon,
  Grid2X2Icon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImagePlusIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";
import Separator from "@/components/common/separator";
import { cn } from "@/utils/className";

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
      <div className="overflow-y-auto max-h-60 app">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  const options: {
    icon: React.ReactNode;
    onClick: () => void;
    name: string;
    attributes?: Record<string, number | string>;
    title?: string;
  }[][] = [
    [
      {
        icon: <UndoIcon className="size-4" />,
        onClick: () => editor.chain().focus().undo().run(),
        name: "undo",
        title: "Undo",
      },
      {
        icon: <RedoIcon className="size-4" />,
        onClick: () => editor.chain().focus().redo().run(),
        name: "redo",
        title: "Redo",
      },
    ],
    [
      {
        icon: <Heading1Icon className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        name: "heading",
        attributes: { level: 1 },
        title: "Heading 1",
      },
      {
        icon: <Heading2Icon className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        name: "heading",
        attributes: { level: 2 },
        title: "Heading 2",
      },
      {
        icon: <Heading3Icon className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        name: "heading",
        attributes: { level: 3 },
        title: "Heading 3",
      },
    ],
    [
      {
        icon: <ListIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        name: "bulletList",
        title: "Bullet List",
      },
      {
        icon: <ListOrderedIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        name: "orderedList",
        title: "Ordered List",
      },
    ],
    [
      {
        icon: <BoldIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleBold().run(),
        name: "bold",
        title: "Bold",
      },
      {
        icon: <ItalicIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        name: "italic",
        title: "Italic",
      },
      {
        icon: <UnderlineIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        name: "underline",
        title: "Underline",
      },
      {
        icon: <StrikethroughIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        name: "strike",
        title: "Strikethrough",
      },
      {
        icon: <LinkIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleLink({ href: "#" }).run(),
        name: "link",
        title: "Link",
      },
    ],
    [
      {
        icon: <SuperscriptIcon className="size-4" />,
        onClick: () => {},
        name: "superscript",
        title: "Superscript",
      },
      {
        icon: <SubscriptIcon className="size-4" />,
        onClick: () => {},
        name: "subscript",
        title: "Subscript",
      },
    ],
    [
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-text-align-start-icon lucide-text-align-start size-4"
          >
            <path d="M21 5H3" />
            <path d="M15 12H3" />
            <path d="M17 19H3" />
          </svg>
        ),
        onClick: () => {},
        name: "align-left",
        title: "Align Left",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-text-align-center-icon lucide-text-align-center size-4"
          >
            <path d="M21 5H3" />
            <path d="M17 12H7" />
            <path d="M19 19H5" />
          </svg>
        ),
        onClick: () => {},
        name: "align-center",
        title: "Align Center",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-text-align-end-icon lucide-text-align-end size-4"
          >
            <path d="M21 5H3" />
            <path d="M21 12H9" />
            <path d="M21 19H7" />
          </svg>
        ),
        onClick: () => {},
        name: "align-right",
        title: "Align Right",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-text-align-justify-icon lucide-text-align-justify size-4"
          >
            <path d="M3 5h18" />
            <path d="M3 12h18" />
            <path d="M3 19h18" />
          </svg>
        ),
        onClick: () => {},
        name: "align-justify",
        title: "Align Justify",
      },
    ],
    [
      {
        icon: <Grid2X2Icon className="size-4" />,
        onClick: () => {},
        name: "table",
        title: "Insert Table",
      },
      {
        icon: <ImagePlusIcon className="size-4" />,
        onClick: () => {},
        name: "image",
        title: "Insert Image",
      },
    ],
  ];
  return (
    <div className="flex mb-2">
      {options.map((group, index) => (
        <div key={index} className="flex">
          {group.map((option, idx) => (
            <MenuButton
              key={idx}
              editor={editor}
              onClick={option.onClick}
              content={option.icon}
              title={option.title}
              name={option.name}
            />
          ))}
          {index < options.length - 1 && (
            <div className="border-r border-gray-300 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}

function MenuButton({
  editor,
  content,
  onClick,
  name,
  attributes,
  title,
  disabled,
}: {
  editor: Editor | null;
  content: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  name: string;
  attributes?: Record<string, number | string>;
  title?: string;
}) {
  const [active, setActive] = React.useState(
    editor?.isActive(name, attributes) || false
  );
  React.useEffect(() => {
    if (!editor) return;

    const update = () => setActive(editor.isActive(name, attributes));

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor, name, attributes]);
  if (!editor) return null;
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
        setActive(editor.isActive(name, attributes));
      }}
      disabled={disabled}
      data-state={active}
      className="data-[state=true]:text-white data-[state=true]:bg-primary cursor-pointer transition-all duration-200 rounded-md p-2 hover:bg-primary/10"
      title={title}
    >
      {content}
    </button>
  );
}
