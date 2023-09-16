"use client";
import React, { useState } from "react";
import Image from "next/image";
import hljs from "highlight.js";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";
import ReactQuill from "react-quill";
import CategoryAndEdit from "./CategoryAndEdit";
import SocialLinks from "@/components/myComponents/global/SocialLinks";
import supabase from "@/lib/supabaseClient";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useTheme } from "next-themes";
// import "./highlight.css";

function cn(...classes: string[]) {
   return classes.filter(Boolean).join(" ");
}
hljs.configure({
   // optionally configure hljs
   languages: [
      "javascript",
      "python",
      "c",
      "c++",
      "java",
      "HTML",
      "css",
      "matlab",
      "typescript",
   ],
});

const modules = {
   syntax: {
      highlight: function (text: string) {
         return hljs.highlightAuto(text).value;
      },
   },
   clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
   },
   toolbar: [
      [
         { header: "1" },
         { header: "2" },
         { font: [] },
         { list: "ordered" },
         { list: "bullet" },
         { indent: "-1" },
         { indent: "+1" },
         "code-block",
         "clean",
         "blockquote",
         "strike",
         "align",
         "underline",
         "italic",
         "bold",
         "color",
         "link",
         "image",
         "video",
         "background",
      ],
   ],
};

const formats = [
   "header",
   "font",
   "size",
   "bold",
   "italic",
   "underline",
   "align",
   "strike",
   "script",
   "blockquote",
   "background",
   "list",
   "bullet",
   "indent",
   "link",
   "image",
   "color",
   "code-block",
   "video",
];

const Content = ({ post, loading }: { post: any; loading: boolean }) => {
   const { theme } = useTheme();
   const [isLoading, setLoading] = useState(true);
   const [isEditable, setIsEditable] = useState<boolean>(false);

   const [title, setTitle] = useState<string>(post?.title);
   const [snippet, setSnippet] = useState<string>(post?.snippet);

   const [titleError, setTitleError] = useState<string>("");
   const [snippetError, setSnippetError] = useState<string>("");

   const [tempTitle, setTempTitle] = useState<string>(title);

   const [content, setContent] = useState<string>(post?.content);
   const [contentError, setContentError] = useState<string>("");
   const [tempContent, setTempContent] = useState<string>(content);
   const [tempSnippet, setTempSnippet] = useState<string>(snippet);

   const date = post?.created_at ? new Date(post.created_at) : null;
   const options = { year: "numeric", month: "long", day: "numeric" } as any;
   const formattedDate = date?.toLocaleDateString("en-US", options);

   const handleIsEditable = (bool: boolean) => {
      setIsEditable(bool);
   };

   const handleOnChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (title) setTitleError("");
      setTitle(e.target.value);
   };

   const handleOnChangeSnippet = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (snippet) setSnippetError("");
      setSnippet(e.target.value);
   };

   const handleOnChangeContent = (value: string) => {
      if (value.trim() !== "<p><br></p>") setContentError("");
      setContent(value);
   };

   // const handleOnChangeContent = (value: string) => {
   //    // Clear content error if the value is not just an empty paragraph
   //    if (value.trim() !== "<p><br></p>") setContentError("");

   //    // Delay the content update by 2000 milliseconds (2 seconds)
   //    setTimeout(() => {
   //       // Update the content state
   //       setContent(value);

   //       // If you want to set the value of 'value', you can do it here
   //       // setValue(value);
   //    }, 2000);
   // };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validation checks
      if (title.trim() === "") {
         setTitleError("Title is required.");
         return;
      }

      if (snippet.trim() === "") {
         setSnippetError("Snippet is required.");
         return;
      }

      if (content.trim() === "<p><br></p>") {
         setContentError("Content is required.");
         return;
      }

      // Update the post with the new data
      const { data, error } = await supabase
         .from("posts")
         .update({
            title: title,
            snippet: snippet,
            content: content,
         })
         .eq("id", post.id)
         .single();

      if (error) {
         // Handle the error, e.g., display an error message
         console.error("Error updating the post:", error);
      } else {
         // Update the state with the new data
         setTitle(title || "");
         setSnippet(snippet || "");
         setContent(content || "");
         handleIsEditable(false);
      }
   };

   return (
      <div className="w-full max-w-full mb-10 prose">
         {/* BREADCRUMBS */}

         <h5 className="pb-5 text-wh-300">{`Home > ${post?.category_name} > ${post?.title}`}</h5>

         {/* CATEGORY AND EDIT */}
         <CategoryAndEdit
            isEditable={isEditable}
            handleIsEditable={handleIsEditable}
            title={title}
            content={content}
            setContent={setContent}
            snippet={snippet}
            setTitle={setTitle}
            setSnippet={setSnippet}
            tempTitle={tempTitle}
            setTempTitle={setTempTitle}
            tempSnippet={tempSnippet}
            setTempSnippet={setTempSnippet}
            tempContent={tempContent}
            setTempContent={setTempContent}
            post={post}
         />

         <form onSubmit={handleSubmit}>
            {/* HEADER */}

            {/* TITLE */}
            {isEditable ? (
               <div>
                  <input
                     type="text"
                     className="w-full p-3 mb-3 border-2 rounded-md bg-wh-50 dark:bg-black"
                     placeholder="Title"
                     onChange={handleOnChangeTitle}
                     value={title}
                  />
                  {titleError && (
                     <p className="mt-1 text-primary-500">{titleError}</p>
                  )}
               </div>
            ) : (
               <h3 className="mt-3 text-3xl font-bold">{title}</h3>
            )}

            {/* SNIPPET */}
            {isEditable ? (
               <div>
                  <input
                     type="text"
                     className="w-full p-3 border-2 rounded-md opacity-70 bg-wh-50 dark:bg-black"
                     placeholder="Snippet"
                     onChange={handleOnChangeSnippet}
                     value={snippet}
                  />
                  {snippetError && (
                     <p className="mt-1 text-primary-500">{snippetError}</p>
                  )}
               </div>
            ) : (
               <p className="mt-3 mb-6 text-lg">{snippet}</p>
            )}
            <div className="flex gap-3">
               <h5 className="text-xs font-semibold">By {post?.author}</h5>
               <h6 className="text-xs text-wh-300">{formattedDate}</h6>
            </div>

            {/* IMAGE */}
            <div className="relative w-auto mt-2 mb-16 h-96">
               <Image
                  fill
                  alt={post?.title}
                  src={post?.image}
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 85vw, (max-width: 1060px) 75vw, 60vw"
                  style={{ objectFit: "cover" }}
                  className={cn(
                     "duration-700 ease-in-out",
                     isLoading
                        ? "grayscale blur-2xl scale-110"
                        : "grayscale-0 blur-0 scale-100"
                  )}
                  onLoadingComplete={() => setLoading(false)}
               />
            </div>
            <div
               className={
                  isEditable
                     ? "bg-wh-50 dark:bg-black p-3"
                     : "w-full max-w-full"
               }>
               {isEditable ? (
                  // <ReactQuill
                  //    modules={modules}
                  //    theme="snow"
                  //    formats={formats}
                  //    value={content}
                  //    onChange={(content, delta, source, editor) => {
                  //       // Delay the update by 2000 milliseconds (2 seconds)
                  //       setTimeout(() => {
                  //          // Update your state or do anything with the content here
                  //          setContent(content);

                  //          // If you want to set the value of 'value', you can do it here
                  //          // setValue(content);
                  //       }, 2000);
                  //    }}
                  // />
                  <ReactQuill
                     modules={modules}
                     theme="snow"
                     formats={formats}
                     value={content}
                     onChange={handleOnChangeContent}
                  />
               ) : (
                  <div className="ql-snow">
                     <div className="ql-editor">
                        <ReactMarkdown
                           children={content}
                           // @ts-ignore
                           rehypePlugins={[rehypeRaw]}
                        />
                     </div>
                  </div>
                  // <div
                  //    dangerouslySetInnerHTML={{ __html: content }}
                  //    className="w-full max-w-full leading-8 prose-sm prose xl:prose-2xl focus:outline-none ql-editor"
                  // />
               )}
            </div>

            {/* SUBMIT BUTTON */}
            {isEditable && (
               <div className="flex justify-end">
                  <button
                     type="submit"
                     className="px-5 py-2 mt-5 font-semibold bg-accent-red hover:bg-wh-500 text-wh-10">
                     SUBMIT
                  </button>
               </div>
            )}
         </form>

         {/* SOCIAL LINKS */}
         <div className="hidden w-1/3 mt-10 md:block">
            {theme === "dark" ? <SocialLinks /> : <SocialLinks isDark={true} />}
         </div>
      </div>
   );
};

export default Content;
