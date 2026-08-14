"use client";

import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import TextEditorBubbleMenu from "./TextEditorBubbleMenu";
import TextEditorLinkModal from "./TextEditorLinkModal";
import TextEditorMenu from "./TextEditorMenu";
import "./textEditor.css";

interface ITextEditorTipTap {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TextEditorTipTap({
  value = "",
  onChange,
  placeholder = "Write something amazing...",
  className = "",
}: ITextEditorTipTap) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5 my-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5 my-2",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-gray-800 text-white p-4 rounded",
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "px-1 rounded",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  // Update content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Add link function
  const addLink = () => {
    if (linkUrl.trim() && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setIsLinkModalOpen(false);
    }
  };

  // Color picker functions
  const setTextColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  const setHighlightColor = (color: string) => {
    editor?.chain().focus().setHighlight({ color }).run();
  };

  if (!editor) {
    return (
      <div className={`border rounded-lg animate-pulse min-h-75 ${className}`}>
        <div className="h-10 bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 bg-white rounded-b-lg"></div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg shadow-sm ${className}`}>
      {/* Main Menu */}
      <TextEditorMenu
        editor={editor}
        onLinkClick={() => setIsLinkModalOpen(true)}
        onTextColorChange={setTextColor}
        onHighlightColorChange={setHighlightColor}
      />

      {/* Link Modal */}
      <TextEditorLinkModal
        isOpen={isLinkModalOpen}
        linkUrl={linkUrl}
        onLinkUrlChange={setLinkUrl}
        onAddLink={addLink}
        onClose={() => {
          setIsLinkModalOpen(false);
          setLinkUrl("");
        }}
      />

      {/* Bubble Menu */}
      <TextEditorBubbleMenu
        editor={editor}
        onLinkClick={() => setIsLinkModalOpen(true)}
      />

      {/* Editor Content */}
      <div className="min-h-75 max-h-140 overflow-y-auto bg-white rounded-b-lg">
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      <div className="px-4 py-2 border-t text-sm text-gray-500 bg-gray-50 rounded-b-lg">
        {editor?.storage.characterCount?.characters()} characters
      </div>
    </div>
  );
}
