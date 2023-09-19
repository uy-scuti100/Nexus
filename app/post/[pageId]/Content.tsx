"use client";
import React, { useEffect, useState } from "react";
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
import { useFetchUser } from "@/hooks/useFetchUser";
import { useTheme } from "next-themes";
import { Comment, Post } from "@/types";
import { MessageCircle } from "lucide-react";
import avatar from "../../../public/png.png";
import { Textarea } from "@/components/ui/textarea";
import CommentList from "./CommentList";
import toast from "react-hot-toast";
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
//    check for bookmark based on user

const Content = ({ post, loading }: { post: Post; loading: boolean }) => {
   const { theme } = useTheme();
   const [isLoading, setLoading] = useState(true);
   const [isEditable, setIsEditable] = useState<boolean>(false);
   const [commentText, setCommentText] = useState("");
   const [title, setTitle] = useState<string>(post?.title);
   const [snippet, setSnippet] = useState<string>(post?.snippet);
   const [titleError, setTitleError] = useState<string>("");
   const [commentError, setCommentError] = useState<string>("");
   const [snippetError, setSnippetError] = useState<string>("");
   const [tempTitle, setTempTitle] = useState<string>(title);
   const [content, setContent] = useState<string>(post?.content);
   const [contentError, setContentError] = useState<string>("");
   const [tempContent, setTempContent] = useState<string>(content);
   const [tempSnippet, setTempSnippet] = useState<string>(snippet);
   const [bookmarkCount, setBookmarkCount] = useState(post?.bookmark_count);
   const [comments, setComments] = useState<Comment[]>([]);
   const [commentCount, setCommentcount] = useState(post?.comment_count);
   const [likeCount, setLikeCount] = useState(post?.likes_count);
   const [isBookmarked, setIsBookmarked] = useState(false);
   const [isLiked, setIsLiked] = useState(false);
   const { user } = useFetchUser();
   const userId = user?.id;
   const postId = post?.id;
   const userImg = user?.display_pic;
   const date = post?.created_at ? new Date(post.created_at) : null;
   const options = { year: "numeric", month: "long", day: "numeric" } as any;
   const formattedDate = date?.toLocaleDateString("en-US", options);

   /////////////////////////////////////////////////////////////////////////////////

   // post editing functionalities

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
      setContent(value.valueOf());
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

   // handle form submit
   const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (commentText.trim() === "") {
         setCommentError("Comment field cant be empty.");
         return;
      }

      try {
         // Make an API request to submit the comment using Supabase
         const { data, error } = await supabase
            .from("comments")
            .insert([
               {
                  content: commentText,
                  profile_id: userId,
                  post_id: postId,
               },
            ])
            .select();

         if (!error) {
            // Comment successfully submitted, you can update the UI as needed
            setCommentText("");
            // Optionally, you can refresh the comments or update the UI with the new comment data.
            if (data && data.length > 0) {
               // Prepend the new comment to the comments array to display it first
               setComments([data[0], ...comments]);
            }
            toast.success("comment sent");
         } else {
            // Handle errors, e.g., show an error message
            toast.error("Failed to upodate Post");
            console.error("Error submitting comment:", error);
         }
      } catch (error) {
         console.error("Error submitting comment:", error);
      }
   };

   useEffect(() => {
      // Fetch comments when the component mounts
      fetchComments();
   }, []);

   //////////////////////////////////////////////////////////////////////////////////////////////////
   // comment like ansd bookmmark functionality

   useEffect(() => {
      const checkBookmarkStatus = async () => {
         if (postId && userId) {
            const { data, error } = await supabase
               .from("bookmarks")
               .select("*")
               .eq("profile_id", userId)
               .eq("post_id", postId);

            if (data && data.length > 0) {
               setIsBookmarked(true);
            }
         }
      };

      checkBookmarkStatus();
   }, [postId, userId]);

   // Check if the user has liked the post
   const checkLikeStatus = async () => {
      if (postId && userId) {
         const { data, error } = await supabase
            .from("likes")
            .select("*")
            .eq("profile_id", userId)
            .eq("post_id", postId);

         if (data && data.length > 0) {
            setIsLiked(true);
         }
      }
   };

   useEffect(() => {
      checkLikeStatus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [postId, userId]);

   //    toggle bookmark
   const toggleBookmark = async () => {
      if (isBookmarked) {
         // Remove the bookmark
         await supabase
            .from("bookmarks")
            .delete()
            .eq("profile_id", userId)
            .eq("post_id", postId);

         setIsBookmarked(false);
         // Decrement the bookmark_count
         setBookmarkCount((prevCount) => prevCount - 1);
      } else {
         // Add the bookmark
         await supabase.from("bookmarks").insert([
            {
               profile_id: userId,
               post_id: postId,
            },
         ]);

         setIsBookmarked(true);
         // Increment the bookmark_count
         setBookmarkCount((prevCount) => prevCount + 1);
      }
   };

   // Toggle the like
   const toggleLike = async () => {
      if (isLiked) {
         // Remove the like
         await supabase
            .from("likes")
            .delete()
            .eq("profile_id", userId)
            .eq("post_id", postId);

         setIsLiked(false);
         // Decrement the like_count (if you have it)
         setLikeCount((prevCount: any) => prevCount - 1);
      } else {
         // Add the like
         await supabase.from("likes").insert([
            {
               profile_id: userId,
               post_id: postId,
            },
         ]);

         setIsLiked(true);
         // Increment the like_count (if you have it)
         setLikeCount((prevCount: any) => prevCount + 1);
      }
   };

   const fetchComments = async () => {
      try {
         const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: false });

         if (!error) {
            setComments(data || []);
         } else {
            console.error("Error fetching comments:", error);
         }
      } catch (error) {
         console.error("Error fetching comments:", error);
      }
   };
   // const fetchCommentss = async () => {
   //    const { data, error } = await supabase.from("comments").sql(`
   //        WITH RECURSIVE CommentTree AS (
   //          SELECT
   //            id,
   //            content,
   //            profile_id,
   //            parent_comment_id,
   //            0 AS depth
   //          FROM comments
   //          WHERE parent_comment_id IS NULL -- Top-level comments
   //          UNION ALL
   //          SELECT
   //            c.id,
   //            c.content,
   //            c.profile_id,
   //            c.parent_comment_id,
   //            ct.depth + 1 AS depth
   //          FROM comments c
   //          INNER JOIN CommentTree ct ON c.parent_comment_id = ct.id
   //        )
   //        SELECT
   //          ct.id,
   //          ct.content,
   //          ct.profile_id,
   //          ct.depth,
   //          COALESCE(cl.like_count, 0) AS like_count
   //        FROM CommentTree ct
   //        LEFT JOIN (
   //          SELECT comment_id, COUNT(*) AS like_count
   //          FROM comment_likes
   //          GROUP BY comment_id
   //        ) cl ON ct.id = cl.comment_id
   //        ORDER BY ct.depth, ct.id;
   //      `);

   //    if (error) {
   //       console.error(error);
   //    } else {
   //       return data;
   //    }
   // };

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
                     className="w-full p-3 my-3 border-2 rounded-md bg-wh-50 dark:bg-black"
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
                     className="w-full p-3 mb-3 border-2 rounded-md bg-wh-50 dark:bg-black"
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
                           // @ts-ignore
                           rehypePlugins={[rehypeRaw]}>
                           {content}
                        </ReactMarkdown>
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
                     className="px-5 py-2 mt-5 font-semibold bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
                     SUBMIT
                  </button>
               </div>
            )}
         </form>
         <div className="flex items-center justify-between w-full px-4 py-5 border-y md:gap-20 md:justify-normal ">
            <div className="flex items-center gap-1">
               <button onClick={toggleBookmark}>
                  {isBookmarked ? (
                     // Bookmarked
                     <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        // @ts-ignore
                        className="ut">
                        <title>unbookmark</title>
                        <path
                           d="M7.5 3.75a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-14a2 2 0 0 0-2-2h-9z"
                           fill="currentcolor"></path>
                     </svg>
                  ) : (
                     // Not bookmarked
                     <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={theme === "dark" ? "#ffffff" : "#000"}
                        // @ts-ignore
                        className="no">
                        <title>bookmark</title>
                        <path
                           d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                           fill="currentcolor"></path>
                     </svg>
                  )}
               </button>
               <p>{bookmarkCount > 0 ? <p>{bookmarkCount}</p> : ""}</p>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
               <MessageCircle className="w-6 h-6 opacity-70" />
               <p>{commentCount > 0 ? <p>{commentCount}</p> : ""}</p>
            </div>
            <div className="flex items-center gap-1">
               <button onClick={toggleLike}>
                  {isLiked ? (
                     <svg
                        aria-label="Unlike"
                        // @ts-ignore
                        class="x1lliihq x1n2onr6"
                        color="rgb(255, 48, 64)"
                        fill={theme === "dark" ? "#ffffff" : "#000"}
                        height="20"
                        role="img"
                        viewBox="0 0 48 48"
                        width="20">
                        <title>Unlike</title>
                        <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                     </svg>
                  ) : (
                     <svg
                        className="opacity-70"
                        aria-label="Like"
                        // @ts-ignore
                        class="x1lliihq x1n2onr6"
                        color="#fff"
                        fill="rgb(38, 38, 38)"
                        height="24"
                        role="img"
                        viewBox="0 0 24 24"
                        width="24">
                        <title>Like</title>
                        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                     </svg>
                  )}
               </button>
               <p>{likeCount > 0 ? <p>{likeCount}</p> : ""}</p>
            </div>
         </div>

         {/* COMMENT LOGIC */}
         <div className="w-full py-4 mt-4">
            <form
               className="flex flex-col items-center w-full gap-3"
               onSubmit={handleSubmitComment}>
               <div className="flex items-center justify-between w-full gap-3">
                  <div className=" w-[60px]">
                     <Image
                        src={user ? (userImg as string) : avatar}
                        width={48}
                        height={48}
                        alt="user-profile-img"
                        className="rounded-full border border-accent-orange w-[48px] h-[48px] cursor-pointer"
                     />
                  </div>
                  <Textarea
                     placeholder="Post your reply..."
                     style={{
                        height: "100px",
                        resize: "none",
                     }}
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                  />
                  {commentError && (
                     <p className="mt-1 text-primary-500">{commentError}</p>
                  )}
               </div>
               <div className="flex justify-end w-full">
                  <button
                     type="submit"
                     className="w-full px-5 py-2 mt-5 font-semibold md:w-auto bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
                     POST
                  </button>
               </div>
            </form>
         </div>
         <div className="pt-4 border-t">
            {/* Pass the comments array to the CommentList component */}
            {comments && comments.length > 0 && (
               <h1 className="pb-5 mb-5 text-2xl">Comments</h1>
            )}
            <CommentList comments={comments} />
         </div>
         {/* SOCIAL LINKS */}
         <div className="hidden w-1/3 mt-10 md:block">
            {theme === "dark" ? <SocialLinks /> : <SocialLinks isDark={true} />}
         </div>
      </div>
   );
};

export default Content;
