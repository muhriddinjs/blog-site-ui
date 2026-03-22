import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "link",
    "image",
    "code-block",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="bg-white dark:bg-gray-900 rounded-lg"
      />
      <style>{`
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: rgb(209 213 219);
        }
        .dark .ql-toolbar {
          border-color: rgb(75 85 99);
          background: rgb(17 24 39);
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: rgb(209 213 219);
          min-height: 300px;
        }
        .dark .ql-container {
          border-color: rgb(75 85 99);
        }
        .ql-editor {
          min-height: 300px;
        }
        .dark .ql-editor {
          color: rgb(243 244 246);
        }
        .dark .ql-stroke {
          stroke: rgb(156 163 175);
        }
        .dark .ql-fill {
          fill: rgb(156 163 175);
        }
        .dark .ql-picker-label {
          color: rgb(156 163 175);
        }
      `}</style>
    </div>
  );
}
