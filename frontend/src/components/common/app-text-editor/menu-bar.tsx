import {
  BoldIcon,
  Grid2X2Icon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
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

import { Editor } from "@tiptap/react";
import EditorButton from "@/components/common/app-text-editor/editor-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo } from "react";

function getTableOptions(editor: Editor) {
  return [
    {
      group: "Table",
      actions: [
        {
          name: "Insert",
          onClick: () =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run(),
        },
        {
          name: "Delete",
          onClick: () => editor.chain().focus().deleteTable().run(),
        },
      ],
    },
    {
      group: "Row",
      actions: [
        {
          name: "Insert row above",
          onClick: () => editor.chain().focus().addRowBefore().run(),
        },
        {
          name: "Insert row below",
          onClick: () => editor.chain().focus().addRowAfter().run(),
        },
        {
          name: "Delete row",
          onClick: () => editor.chain().focus().deleteRow().run(),
        },
      ],
    },
    {
      group: "Column",
      actions: [
        {
          name: "Insert column left",
          onClick: () => editor.chain().focus().addColumnBefore().run(),
        },
        {
          name: "Insert column right",
          onClick: () => editor.chain().focus().addColumnAfter().run(),
        },
        {
          name: "Delete column",
          onClick: () => editor.chain().focus().deleteColumn().run(),
        },
      ],
    },
    {
      group: "Cell",
      actions: [
        {
          name: "Merge cells",
          onClick: () => editor.chain().focus().mergeCells().run(),
        },
        {
          name: "Split cell",
          onClick: () => editor.chain().focus().splitCell().run(),
        },
      ],
    },
  ];
}

function getMenuOptions(editor: Editor): {
  icon: React.ReactNode;
  onClick: () => void;
  checkActive: () => boolean;
  title?: string;
  checkDisabled?: () => boolean;
  className?: string;
}[][] {
  return [
    [
      {
        icon: <UndoIcon className="size-4" />,
        onClick: () => editor.chain().focus().undo().run(),
        checkActive: () => editor.isActive("undo"),
        title: "Undo",
        checkDisabled: () => !editor.can().undo(),
      },
      {
        icon: <RedoIcon className="size-4" />,
        onClick: () => editor.chain().focus().redo().run(),
        checkActive: () => editor.isActive("redo"),
        title: "Redo",
        checkDisabled: () => !editor.can().redo(),
      },
    ],
    [
      {
        icon: <Heading1Icon className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        checkActive: () => editor.isActive("heading", { level: 1 }),
        title: "Heading 1",
      },
      {
        icon: <Heading2Icon className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        checkActive: () => editor.isActive("heading", { level: 2 }),
        title: "Heading 2",
      },
      {
        icon: <Heading3Icon className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        checkActive: () => editor.isActive("heading", { level: 3 }),
        title: "Heading 3",
      },
    ],
    [
      {
        icon: <ListIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        checkActive: () => editor.isActive("bulletList"),
        title: "Bullet List",
      },
      {
        icon: <ListOrderedIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        checkActive: () => editor.isActive("orderedList"),
        title: "Ordered List",
      },
    ],
    [
      {
        icon: <BoldIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleBold().run(),
        checkActive: () => editor.isActive("bold"),
        title: "Bold",
      },
      {
        icon: <ItalicIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        checkActive: () => editor.isActive("italic"),
        title: "Italic",
      },
      {
        icon: <UnderlineIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        checkActive: () => editor.isActive("underline"),
        title: "Underline",
      },
      {
        icon: <StrikethroughIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        checkActive: () => editor.isActive("strike"),
        title: "Strikethrough",
      },
      {
        icon: <LinkIcon className="size-4" />,
        onClick: () => {
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("URL", previousUrl);

          // cancelled
          if (url === null) {
            return;
          }

          // empty
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }

          // update link
          try {
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          } catch {
            alert("Invalid URL");
          }
        },
        checkActive: () => editor.isActive("link"),
        title: "Link",
      },
    ],
    [
      {
        icon: <SuperscriptIcon className="size-4" />,
        onClick: () => {
          editor.chain().focus().unsetSubscript().run();
          editor.chain().focus().toggleSuperscript().run();
        },
        checkActive: () => editor.isActive("superscript"),
        title: "Superscript",
      },
      {
        icon: <SubscriptIcon className="size-4" />,
        onClick: () => {
          editor.chain().focus().unsetSuperscript().run();
          editor.chain().focus().toggleSubscript().run();
        },
        checkActive: () => editor.isActive("subscript"),
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
        onClick: () => {
          editor.chain().focus().setTextAlign("left").run();
        },
        checkActive: () => editor.isActive({ textAlign: "left" }),
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
        onClick: () => {
          editor.chain().focus().setTextAlign("center").run();
        },
        checkActive: () => editor.isActive({ textAlign: "center" }),
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
        onClick: () => {
          editor.chain().focus().setTextAlign("right").run();
        },
        checkActive: () => editor.isActive({ textAlign: "right" }),
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
        onClick: () => {
          editor.chain().focus().setTextAlign("justify").run();
        },
        checkActive: () => editor.isActive({ textAlign: "justify" }),
        title: "Align Justify",
      },
    ],
    [
      {
        icon: (
          <Popover>
            <PopoverTrigger className="p-2 cursor-pointer">
              <Grid2X2Icon className="size-4" />
            </PopoverTrigger>
            <PopoverContent
              className="flex flex-col items-start max-h-64 overflow-y-auto app w-fit"
              align="start"
              side="left"
            >
              {getTableOptions(editor).map((group) => (
                <div
                  key={group.group}
                  className="mb-2 flex flex-col items-start w-full"
                >
                  <p className="text-sm opacity-50 px-2">{group.group}</p>
                  {group.actions.map((action) => (
                    <div
                      key={action.name}
                      className="cursor-pointer hover:bg-gray-200 rounded px-2 py-1 w-full text-start"
                      onClick={action.onClick}
                    >
                      {action.name}
                    </div>
                  ))}
                </div>
              ))}
            </PopoverContent>
          </Popover>
        ),
        onClick: () => {},
        checkActive: () => editor.isActive("table"),
        title: "Table",
        className: "p-0",
      },
    ],
  ];
}

export default function MenuBar({ editor }: { editor: Editor | null }) {
  const menuOpts = useMemo(() => {
    if (!editor) return [];
    return getMenuOptions(editor);
  }, [editor]);
  return (
    <div className="flex mb-2">
      {menuOpts.map((group, index) => (
        <div key={index} className="flex">
          {group.map((option, idx) => (
            <EditorButton
              key={idx}
              editor={editor}
              onClick={option.onClick}
              content={option.icon}
              title={option.title}
              checkActive={option.checkActive}
              checkDisabled={option.checkDisabled}
              className={option.className}
            />
          ))}
          {index < menuOpts.length - 1 && (
            <div className="border-r border-gray-300 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}
