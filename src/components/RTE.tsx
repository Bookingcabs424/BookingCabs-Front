"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image"

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

type RTEProps = {
    content?: string;
    onChange?: (content: string) => void; // Add onChange prop
}

const RTE: React.FC<RTEProps> = ({ content, onChange }: RTEProps) => {
  const editor = useEditor({
    extensions: [
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      StarterKit,
      Image,
    ],
    content: content,
    
    // Add onUpdate to handle changes
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html); // Call onChange callback if provided
    },
    
    // Update content when prop changes
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  // Update editor content when content prop changes
  React.useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="editor-wrapper w-full">
        <div className="min-h-[200px] border border-gray-300 rounded-md p-4 bg-gray-50 flex items-center justify-center">
          Loading editor...
        </div>
      </div>
    );
  }

  const insertImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const btn = (label: React.ReactNode, cmd: () => void, active: boolean) => (
    <button
      onClick={() => cmd()}
      className={`p-2 rounded border ${
        active 
          ? "bg-blue-500 text-white border-blue-500" 
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      } transition-colors`}
      aria-label={typeof label === "string" ? label : undefined}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <div className="editor-wrapper w-full border border-gray-300 rounded-md">
      <div className="toolbar flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50">
        {btn(
          <Bold className="w-4 h-4" />,
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold")
        )}
        {btn(
          <Italic className="w-4 h-4" />,
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic")
        )}
        {btn(
          <UnderlineIcon className="w-4 h-4" />,
          () => editor.chain().focus().toggleUnderline().run(),
          editor.isActive("underline")
        )}
        {btn(
          <List className="w-4 h-4" />,
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList")
        )}
        {btn(
          <ListOrdered className="w-4 h-4" />,
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList")
        )}
        {btn(
          <Heading1 className="w-4 h-4" />,
          () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          editor.isActive("heading", { level: 1 })
        )}
        {btn(
          <Heading2 className="w-4 h-4" />,
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading", { level: 2 })
        )}
        {btn(
          <AlignLeft className="w-4 h-4" />,
          () => editor.chain().focus().setTextAlign("left").run(),
          editor.isActive({ textAlign: "left" })
        )}
        {btn(
          <AlignCenter className="w-4 h-4" />,
          () => editor.chain().focus().setTextAlign("center").run(),
          editor.isActive({ textAlign: "center" })
        )}
        {btn(
          <AlignRight className="w-4 h-4" />,
          () => editor.chain().focus().setTextAlign("right").run(),
          editor.isActive({ textAlign: "right" })
        )}
        <button
          onClick={insertImage}
          className="p-2 rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors text-sm"
          type="button"
        >
          Insert Image
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="editor-content min-h-[200px] bg-white" 
      />
    </div>
  );
};

export default RTE;