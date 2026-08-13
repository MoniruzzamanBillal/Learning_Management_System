// components/TextEditorMenu.tsx
"use client";

import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  RotateCcw,
  RotateCw,
  Strikethrough,
  Type,
  Underline,
} from "lucide-react";
import { useState } from "react";

interface ITextEditorMenuProps {
  editor: Editor | null;
  onLinkClick: () => void;
  onTextColorChange: (color: string) => void;
  onHighlightColorChange: (color: string) => void;
}

export default function TextEditorMenu({
  editor,
  onLinkClick,
  onTextColorChange,
  onHighlightColorChange,
}: ITextEditorMenuProps) {
  const [isTextColorOpen, setIsTextColorOpen] = useState(false);
  const [isHighlightColorOpen, setIsHighlightColorOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const colorOptions = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#FF0000" },
    { name: "Green", value: "#00FF00" },
    { name: "Blue", value: "#0000FF" },
    { name: "Orange", value: "#FFA500" },
    { name: "Purple", value: "#800080" },
  ];

  const highlightOptions = [
    { name: "Yellow", value: "#FFFF00" },
    { name: "Light Green", value: "#90EE90" },
    { name: "Sky Blue", value: "#87CEEB" },
    { name: "Pink", value: "#FFB6C1" },
    { name: "Lavender", value: "#E6E6FA" },
    { name: "Gold", value: "#FFD700" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 p-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("underline") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("strike") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 p-1 border-r pr-2">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-blue-100 text-blue-600" : ""}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-blue-100 text-blue-600" : ""}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 3 }) ? "bg-blue-100 text-blue-600" : ""}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 p-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Text Alignment */}
      <div className="flex items-center gap-1 p-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-600" : ""}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-600" : ""}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-600" : ""}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "justify" }) ? "bg-blue-100 text-blue-600" : ""}`}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      {/* Colors & Highlight */}
      <div className="flex items-center gap-1 p-1 border-r pr-2">
        {/* Text Color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTextColorOpen(!isTextColorOpen)}
            className="p-2 rounded hover:bg-gray-200"
            title="Text Color"
          >
            <Type className="w-4 h-4" />
          </button>
          {isTextColorOpen && (
            <div className="absolute top-full left-0 mt-1 flex flex-wrap gap-1 p-2 bg-white border rounded-lg shadow-lg z-10 w-40">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    onTextColorChange(color.value);
                    setIsTextColorOpen(false);
                  }}
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              <input
                type="color"
                onChange={(e) => {
                  onTextColorChange(e.target.value);
                  setIsTextColorOpen(false);
                }}
                className="w-full mt-1"
              />
            </div>
          )}
        </div>

        {/* Highlight Color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsHighlightColorOpen(!isHighlightColorOpen)}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("highlight") ? "bg-blue-100 text-blue-600" : ""}`}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          {isHighlightColorOpen && (
            <div className="absolute top-full left-0 mt-1 flex flex-wrap gap-1 p-2 bg-white border rounded-lg shadow-lg z-10 w-40">
              {highlightOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    onHighlightColorChange(color.value);
                    setIsHighlightColorOpen(false);
                  }}
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              <input
                type="color"
                onChange={(e) => {
                  onHighlightColorChange(e.target.value);
                  setIsHighlightColorOpen(false);
                }}
                className="w-full mt-1"
              />
            </div>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-1 p-1 border-r pr-2">
        <button
          type="button"
          onClick={onLinkClick}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Other Formatting */}
      <div className="flex items-center gap-1 p-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("code") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Horizontal Line"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1 p-1 border-l pl-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
