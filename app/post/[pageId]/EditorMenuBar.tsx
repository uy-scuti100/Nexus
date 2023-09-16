import { Editor } from "@tiptap/react";
import { Code as Codeicon, List, Minus, Quote, Redo, Undo } from "lucide-react";

type Props = {
   editor: Editor | null;
};

const EditorMenuBar = ({ editor }: Props) => {
   if (!editor) {
      return null;
   }

   return (
      <div className="flex items-center justify-between dark:bg-black">
         <div className="flex items-center gap-4 flex-wrap">
            <button
               type="button"
               onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
               }
               className={
                  editor.isActive("heading", { level: 1 })
                     ? "bg-wh-500 text-wh-50 p-1 rounded-md"
                     : "p-1"
               }>
               H<span className="text-xs">1</span>
            </button>
            <button
               type="button"
               onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
               }
               className={
                  editor.isActive("heading", { level: 2 })
                     ? "bg-wh-500 text-wh-50 p-1 rounded-md"
                     : "p-1"
               }>
               H<span className="text-xs">2</span>
            </button>
            <button
               type="button"
               onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
               }
               className={
                  editor.isActive("heading", { level: 3 })
                     ? "bg-wh-500 text-wh-50 p-1 rounded-md"
                     : "p-1"
               }>
               H<span className="text-xs">3</span>
            </button>
            <button
               type="button"
               onClick={() => editor.chain().focus().setParagraph().run()}
               className={
                  editor.isActive("paragraph")
                     ? "bg-wh-500 text-wh-50 p-1 rounded-md"
                     : "p-1"
               }>
               &#182;
            </button>
            <button
               type="button"
               onClick={() => editor.chain().focus().toggleBold().run()}
               disabled={!editor.can().chain().focus().toggleBold().run()}
               className={
                  editor.isActive("bold")
                     ? "bg-wh-500 text-wh-50 p-1 rounded-md"
                     : "p-1"
               }>
               <b>B</b>
            </button>
            <button
               type="button"
               onClick={() => editor.chain().focus().toggleItalic().run()}
               disabled={!editor.can().chain().focus().toggleItalic().run()}
               className={
                  editor.isActive("italic")
                     ? "bg-wh-500 text-wh-50 p-1 rounded-md"
                     : "p-1"
               }>
               <i>i</i>
            </button>
            <button
               onClick={() => editor.chain().focus().toggleStrike().run()}
               disabled={!editor.can().chain().focus().toggleStrike().run()}
               className={
                  editor.isActive("strike")
                     ? "bg-wh-500 text-wh-50 p-1 rounded-md line-through "
                     : "p-1 line-through "
               }>
               S
            </button>
            <button
               onClick={() => editor.chain().focus().toggleCodeBlock().run()}
               className={editor.isActive("codeBlock") ? "is-active" : ""}>
               <Codeicon className="h-4 w-4" />
            </button>
            <button
               onClick={() => editor.chain().focus().toggleBlockquote().run()}
               className={editor.isActive("blockquote") ? "is-active" : ""}>
               <Quote className="h-4 w-4" />
            </button>
            <button
               onClick={() => editor.chain().focus().setHorizontalRule().run()}>
               <Minus className="h-4 w-4" />
            </button>

            <button
               onClick={() => editor.chain().focus().undo().run()}
               disabled={!editor.can().chain().focus().undo().run()}>
               <Undo className="h-4 w-4" />
            </button>
            <button
               onClick={() => editor.chain().focus().redo().run()}
               disabled={!editor.can().chain().focus().redo().run()}>
               <Redo className="h-4 w-4" />
            </button>
            <button
               onClick={() => editor.chain().focus().toggleBulletList().run()}
               className={editor.isActive("bulletList") ? "is-active" : ""}>
               <List />
            </button>
         </div>
      </div>
   );
};

export default EditorMenuBar;
