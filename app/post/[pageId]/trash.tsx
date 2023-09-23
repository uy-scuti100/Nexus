"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { Camera, MessageCircle } from "lucide-react";
import avatar from "../../../public/png.png";
import { Textarea } from "@/components/ui/textarea";
import CommentList from "./CommentList";
import toast from "react-hot-toast";

function cn(...classes: string[]) {
   return classes.filter(Boolean).join(" ");
}

hljs.configure({
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

const Content = ({ post, loading }: { post: Post; loading: boolean }) => {
   const postImageUrl = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_URL;
   const originalPostImage = `${postImageUrl}${post?.image}`;
   const [state, setState] = useState({
      tempPostImage: originalPostImage,
      imageFile: null,
      theme: useTheme(),
      isLoading: true,
      isEditable: false,
      commentText: "",
      title: post?.title,
      postImage: null,
      snippet: post?.snippet,
      titleError: "",
      commentError: "",
      snippetError: "",
      tempTitle: post?.title,
      content: post?.content,
      contentError: "",
      postImageError: "",
      tempContent: post?.content,
      tempSnippet: post?.snippet,
      bookmarkCount: post?.bookmark_count || 0,
      comments: [],
      commentCount: post?.comment_count || 0,
      likeCount: post?.likes_count || 0,
      isBookmarked: false,
      isLiked: false,
   });

   const {
      tempPostImage,
      imageFile,
      theme,
      isLoading,
      isEditable,
      commentText,
      title,
      postImage,
      snippet,
      titleError,
      commentError,
      snippetError,
      tempTitle,
      content,
      contentError,
      postImageError,
      tempContent,
      tempSnippet,
      bookmarkCount,
      comments,
      commentCount,
      likeCount,
      isBookmarked,
      isLiked,
   } = state;

   const options = { year: "numeric", month: "long", day: "numeric" } as any;
   const date = post?.created_at ? new Date(post?.created_at) : null;
   const formattedDate = date?.toLocaleDateString("en-US", options);
   const imageInputRef = useRef<HTMLInputElement | null>(null);
   const { user } = useFetchUser();
   const userImg = user?.display_pic;
   const userId = user?.id;
   const postId = post?.id;

   const updateCommentCount = (newCount: number) => {
      setState((prevState) => ({ ...prevState, commentCount: newCount }));
   };

   const handleIsEditable = (bool: boolean) => {
      setState((prevState) => ({ ...prevState, isEditable: bool }));
   };

   const handleOnChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (title) {
         setState((prevState) => ({ ...prevState, titleError: "" }));
      }
      setState((prevState) => ({ ...prevState, title: e.target.value }));
   };

   const handleOnChangeSnippet = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (snippet) {
         setState((prevState) => ({ ...prevState, snippetError: "" }));
      }
      setState((prevState) => ({ ...prevState, snippet: e.target.value }));
   };

   const handleOnChangeContent = (value: string) => {
      if (content) {
         setState((prevState) => ({ ...prevState, contentError: "" }));
      }
      setState((prevState) => ({ ...prevState, tempContent: value }));
   };

   const handleOnBlurTitle = () => {
      if (!title) {
         setState((prevState) => ({
            ...prevState,
            titleError: "Title is required",
         }));
      }
   };

   const handleOnBlurSnippet = () => {
      if (!snippet) {
         setState((prevState) => ({
            ...prevState,
            snippetError: "Snippet is required",
         }));
      }
   };

   const handleOnBlurContent = () => {
      if (!content) {
         setState((prevState) => ({
            ...prevState,
            contentError: "Content is required",
         }));
      }
   };

   const handleSaveChanges = async () => {
      try {
         setState((prevState) => ({ ...prevState, isLoading: true }));

         if (title && snippet && content) {
            const updates: Partial<Post> = {
               title,
               snippet,
               content: tempContent,
               image: imageFile ? imageFile.name : post.image,
            };

            const { data, error } = await supabase
               .from<Post>("posts")
               .update(updates)
               .eq("id", postId)
               .single();

            if (error) {
               throw error;
            }

            if (data) {
               setState((prevState) => ({
                  ...prevState,
                  isLoading: false,
                  isEditable: false,
                  tempTitle: title,
                  tempSnippet: snippet,
                  tempContent: content,
               }));
            }
         } else {
            setState((prevState) => ({ ...prevState, isLoading: false }));
            if (!title) {
               setState((prevState) => ({
                  ...prevState,
                  titleError: "Title is required",
               }));
            }
            if (!snippet) {
               setState((prevState) => ({
                  ...prevState,
                  snippetError: "Snippet is required",
               }));
            }
            if (!content) {
               setState((prevState) => ({
                  ...prevState,
                  contentError: "Content is required",
               }));
            }
         }
      } catch (error) {
         console.error("Error updating post:", error);
         setState((prevState) => ({ ...prevState, isLoading: false }));
      }
   };

   const handleEditCancel = () => {
      setState((prevState) => ({
         ...prevState,
         isEditable: false,
         title: tempTitle,
         snippet: tempSnippet,
         tempContent,
      }));
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files[0];

      if (file) {
         const reader = new FileReader();

         reader.onload = (e) => {
            if (e.target?.result) {
               setState((prevState) => ({
                  ...prevState,
                  tempPostImage: e.target.result as string,
                  imageFile: file,
               }));
            }
         };

         reader.readAsDataURL(file);
      }
   };

   const handleBookmark = async () => {
      try {
         if (userId && postId) {
            if (isBookmarked) {
               const { data, error } = await supabase
                  .from("bookmarks")
                  .delete()
                  .eq("post_id", postId)
                  .eq("user_id", userId)
                  .single();

               if (error) {
                  throw error;
               }

               if (data) {
                  setState((prevState) => ({
                     ...prevState,
                     isBookmarked: false,
                     bookmarkCount: prevState.bookmarkCount - 1,
                  }));
               }
            } else {
               const newBookmark = {
                  post_id: postId,
                  user_id: userId,
               };

               const { data, error } = await supabase
                  .from("bookmarks")
                  .upsert([newBookmark]);

               if (error) {
                  throw error;
               }

               if (data) {
                  setState((prevState) => ({
                     ...prevState,
                     isBookmarked: true,
                     bookmarkCount: prevState.bookmarkCount + 1,
                  }));
               }
            }
         }
      } catch (error) {
         console.error("Error toggling bookmark:", error);
      }
   };

   const handleLike = async () => {
      try {
         if (userId && postId) {
            if (isLiked) {
               const { data, error } = await supabase
                  .from("likes")
                  .delete()
                  .eq("post_id", postId)
                  .eq("user_id", userId)
                  .single();

               if (error) {
                  throw error;
               }

               if (data) {
                  setState((prevState) => ({
                     ...prevState,
                     isLiked: false,
                     likeCount: prevState.likeCount - 1,
                  }));
               }
            } else {
               const newLike = {
                  post_id: postId,
                  user_id: userId,
               };

               const { data, error } = await supabase
                  .from("likes")
                  .upsert([newLike]);

               if (error) {
                  throw error;
               }

               if (data) {
                  setState((prevState) => ({
                     ...prevState,
                     isLiked: true,
                     likeCount: prevState.likeCount + 1,
                  }));
               }
            }
         }
      } catch (error) {
         console.error("Error toggling like:", error);
      }
   };

   const handleDeletePost = async () => {
      try {
         if (postId) {
            const { data, error } = await supabase
               .from("posts")
               .delete()
               .eq("id", postId)
               .single();

            if (error) {
               throw error;
            }

            if (data) {
               toast.success("Post deleted successfully");
               window.location.href = "/";
            }
         }
      } catch (error) {
         console.error("Error deleting post:", error);
      }
   };

   useEffect(() => {
      if (user && postId) {
         const fetchUserActions = async () => {
            try {
               const { data: bookmarksData, error: bookmarksError } =
                  await supabase
                     .from("bookmarks")
                     .select()
                     .eq("post_id", postId)
                     .eq("user_id", userId)
                     .single();

               if (bookmarksError) {
                  throw bookmarksError;
               }

               const { data: likesData, error: likesError } = await supabase
                  .from("likes")
                  .select()
                  .eq("post_id", postId)
                  .eq("user_id", userId)
                  .single();

               if (likesError) {
                  throw likesError;
               }

               setState((prevState) => ({
                  ...prevState,
                  isBookmarked: !!bookmarksData,
                  isLiked: !!likesData,
               }));
            } catch (error) {
               console.error("Error fetching user actions:", error);
            }
         };

         fetchUserActions();
      }
   }, [user, postId, userId]);

   useEffect(() => {
      if (postId) {
         const fetchComments = async () => {
            try {
               const { data: commentsData, error: commentsError } =
                  await supabase
                     .from<Comment>("comments")
                     .select("*")
                     .eq("post_id", postId)
                     .order("created_at", { ascending: true });

               if (commentsError) {
                  throw commentsError;
               }

               setState((prevState) => ({
                  ...prevState,
                  comments: commentsData || [],
               }));
            } catch (error) {
               console.error("Error fetching comments:", error);
            }
         };

         fetchComments();
      }
   }, [postId]);

   useEffect(() => {
      if (postId) {
         const fetchBookmarkCount = async () => {
            try {
               const { count, error } = await supabase
                  .from("bookmarks")
                  .select("post_id", { count: "exact" })
                  .eq("post_id", postId)
                  .single();

               if (error) {
                  throw error;
               }

               if (count) {
                  setState((prevState) => ({
                     ...prevState,
                     bookmarkCount: count,
                  }));
               }
            } catch (error) {
               console.error("Error fetching bookmark count:", error);
            }
         };

         fetchBookmarkCount();
      }
   }, [postId]);

   useEffect(() => {
      if (postId) {
         const fetchLikeCount = async () => {
            try {
               const { count, error } = await supabase
                  .from("likes")
                  .select("post_id", { count: "exact" })
                  .eq("post_id", postId)
                  .single();

               if (error) {
                  throw error;
               }

               if (count) {
                  setState((prevState) => ({ ...prevState, likeCount: count }));
               }
            } catch (error) {
               console.error("Error fetching like count:", error);
            }
         };

         fetchLikeCount();
      }
   }, [postId]);

   return (
      <div className="w-full max-w-screen-lg px-4 py-8 mx-auto">
         {post ? (
            <div className="flex flex-col">
               <div className="flex items-center mb-4">
                  <div className="relative flex-shrink-0">
                     <div className="w-16 h-16 overflow-hidden rounded-full md:w-20 md:h-20">
                        {post.user?.avatar_url ? (
                           <img
                              className="object-cover w-full h-full rounded-full"
                              src={post.user?.avatar_url}
                              alt={`Profile of ${post.user?.name}`}
                           />
                        ) : (
                           <svg
                              className="w-full h-full text-gray-400 bg-gray-200 rounded-full"
                              fill="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                 fillRule="evenodd"
                                 d="M12 2a7 7 0 100 14 7 7 0 000-14zm0 1a6 6 0 100 12 6 6 0 000-12zm-4.288 8.26a8.961 8.961 0 011.742-4.695A7.013 7.013 0 0012 6a7.013 7.013 0 004.546-1.435 8.961 8.961 0 011.742 4.694 12.942 12.942 0 01-6.578 1.566 12.942 12.942 0 01-6.578-1.566z"
                                 clipRule="evenodd"
                              />
                              <path
                                 fillRule="evenodd"
                                 d="M2 12a10 10 0 1120 0 10 10 0 01-20 0zm11-9a1 1 0 00-1 1v3a1 1 0 002 0V4a1 1 0 00-1-1zm1 13a7.013 7.013 0 005.744-2.935 8.96 8.96 0 01-3.484.718 8.96 8.96 0 01-3.484-.718A7.013 7.013 0 008 16a7.013 7.013 0 00-4.76 1.347A8.96 8.96 0 011.756 14H3a1 1 0 110 2H1.756A8.96 8.96 0 018 18a8.96 8.96 0 013.244-.586A7.013 7.013 0 008 20a7.013 7.013 0 00-4.244-1.347A8.96 8.96 0 011.756 18H0a1 1 0 010-2h1.756A8.96 8.96 0 018 14a8.96 8.96 0 013.484.718A7.013 7.013 0 0012 16a7.013 7.013 0 004.76-1.347A8.96 8.96 0 0122.244 14H24a1 1 0 110 2h-1.756a8.96 8.96 0 01-3.484-.718A7.013 7.013 0 0016 16a7.013 7.013 0 00-4.76-1.347A8.96 8.96 0 0111.756 14H12a1 1 0 000-2h-1.244A8.96 8.96 0 0116 10a8.96 8.96 0 013.484.718A7.013 7.013 0 0020 12a7.013 7.013 0 00-4.244-1.347A8.96 8.96 0 0116.244 10H15a1 1 0 100 2h1.244z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        )}
                     </div>
                     {post.user && (
                        <div className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 bg-green-500 border-2 border-white rounded-full">
                           <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 d="M5 13l4 4L19 7"
                              />
                           </svg>
                        </div>
                     )}
                  </div>
                  {post.user ? (
                     <Link
                        to={`/profile/${post.user.id}`}
                        className="ml-2 text-lg font-medium text-gray-800 dark:text-gray-100 hover:underline">
                        {post.user.name}
                     </Link>
                  ) : (
                     <span className="ml-2 text-lg font-medium text-gray-800 dark:text-gray-100">
                        Anonymous
                     </span>
                  )}
               </div>
               {isEditable ? (
                  <div className="mb-4">
                     <input
                        type="text"
                        className={cn(
                           "w-full p-2 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm transition duration-300",
                           titleError
                              ? "border-red-500"
                              : "focus:border-blue-500 dark:focus:border-blue-500"
                        )}
                        placeholder="Title"
                        value={title}
                        onChange={handleOnChangeTitle}
                        onBlur={handleOnBlurTitle}
                     />
                     {titleError && (
                        <p className="mt-2 text-sm text-red-500">
                           {titleError}
                        </p>
                     )}
                  </div>
               ) : (
                  <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                     {post.title}
                  </h1>
               )}
               <div className="mb-4">
                  {isEditable ? (
                     <input
                        type="text"
                        className={cn(
                           "w-full p-2 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm transition duration-300",
                           snippetError
                              ? "border-red-500"
                              : "focus:border-blue-500 dark:focus:border-blue-500"
                        )}
                        placeholder="Snippet (e.g., a brief description)"
                        value={snippet}
                        onChange={handleOnChangeSnippet}
                        onBlur={handleOnBlurSnippet}
                     />
                  ) : (
                     <p className="mb-2 text-gray-600 dark:text-gray-400">
                        {post.snippet}
                     </p>
                  )}
                  {snippetError && (
                     <p className="mt-2 text-sm text-red-500">{snippetError}</p>
                  )}
               </div>
               {isEditable ? (
                  <div className="mb-4">
                     <ReactQuill
                        theme={theme}
                        modules={modules}
                        formats={formats}
                        value={tempContent}
                        onChange={handleOnChangeContent}
                     />
                     {contentError && (
                        <p className="mt-2 text-sm text-red-500">
                           {contentError}
                        </p>
                     )}
                  </div>
               ) : (
                  <div className="max-w-full mb-4 prose dark:prose-dark">
                     <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                           a: ({ node, ...props }) => (
                              <a
                                 {...props}
                                 className="text-blue-500 hover:underline"
                              />
                           ),
                           img: ({ node, ...props }) => (
                              <img
                                 {...props}
                                 className="h-auto max-w-full"
                                 alt={props.alt || ""}
                              />
                           ),
                        }}>
                        {post.content}
                     </ReactMarkdown>
                  </div>
               )}
               {imageFile && (
                  <div className="mb-4">
                     <img
                        src={tempPostImage}
                        alt="Post cover"
                        className="h-auto max-w-full"
                     />
                  </div>
               )}
               {isEditable && (
                  <div className="mb-4">
                     <label
                        htmlFor="image"
                        className="block mb-2 text-gray-800 dark:text-gray-200">
                        Change Cover Image
                     </label>
                     <div className="flex items-center">
                        <div className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20">
                           <img
                              src={tempPostImage}
                              alt="Post cover"
                              className="object-cover w-full h-full rounded-md"
                           />
                           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                              <Camera className="w-8 h-8 text-white" />
                           </div>
                        </div>
                        <button
                           type="button"
                           className="ml-2 text-blue-500 hover:underline focus:outline-none"
                           onClick={() => imageInputRef.current?.click()}>
                           Change
                        </button>
                     </div>
                     {postImageError && (
                        <p className="mt-2 text-sm text-red-500">
                           {postImageError}
                        </p>
                     )}
                  </div>
               )}
               <div className="mb-4 text-gray-600 dark:text-gray-400">
                  <p className="text-sm">
                     Posted on {formattedDate}{" "}
                     {isEditable && (
                        <span className="ml-2 text-sm">
                           <button
                              type="button"
                              className="text-blue-500 hover:underline focus:outline-none"
                              onClick={handleSaveChanges}>
                              Save
                           </button>{" "}
                           <button
                              type="button"
                              className="text-red-500 hover:underline focus:outline-none"
                              onClick={handleEditCancel}>
                              Cancel
                           </button>
                        </span>
                     )}
                  </p>
               </div>
               <div className="flex items-center mb-4 space-x-2">
                  <button
                     type="button"
                     className={cn(
                        "flex items-center space-x-1 px-3 py-2 border rounded-md focus:outline-none transition duration-300",
                        isBookmarked
                           ? "text-blue-500 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                           : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                     )}
                     onClick={handleBookmark}>
                     <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth="2"
                           d="M4 6s2-4 4-4 4 4 4 4 2-4 4-4M12 2s2 4 4 4 4-4 4-4"
                        />
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth="2"
                           d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                     </svg>
                     <span>{bookmarkCount}</span>
                  </button>
                  <button
                     type="button"
                     className={cn(
                        "flex items-center space-x-1 px-3 py-2 border rounded-md focus:outline-none transition duration-300",
                        isLiked
                           ? "text-red-500 border-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                           : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                     )}
                     onClick={handleLike}>
                     <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        {isLiked ? (
                           <path
                              fillRule="evenodd"
                              d="M8.293 3.293a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L10 5.414 3.707 11.707a1 1 0 01-1.414-1.414l6-6z"
                              clipRule="evenodd"
                           />
                        ) : (
                           <path
                              fillRule="evenodd"
                              d="M10 3a5 5 0 100 10 5 5 0 000-10zM8.293 5.293a1 1 0 111.414-1.414l1 1a1 1 0 01-1.414 1.414l-1-1z"
                              clipRule="evenodd"
                           />
                        )}
                     </svg>
                     <span>{likeCount}</span>
                  </button>
                  {user && post.user && user.id === post.user.id && (
                     <button
                        type="button"
                        className="flex items-center px-3 py-2 space-x-1 text-red-500 transition duration-300 border rounded-md hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 focus:outline-none"
                        onClick={handleDeletePost}>
                        <Trash className="w-5 h-5" />
                        <span>Delete</span>
                     </button>
                  )}
               </div>
               <div className="pt-4 mb-4 border-t border-gray-300 dark:border-gray-700">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                     Comments ({comments.length})
                  </h2>
                  {user ? (
                     <div className="mb-4">
                        <div className="flex items-center space-x-4">
                           {user.avatar_url ? (
                              <img
                                 src={user.avatar_url}
                                 alt={`Profile of ${user.name}`}
                                 className="w-10 h-10 rounded-full"
                              />
                           ) : (
                              <div className="flex items-center justify-center w-10 h-10 text-gray-400 bg-gray-200 rounded-full">
                                 <User className="w-6 h-6" />
                              </div>
                           )}
                           <div className="flex-1">
                              <textarea
                                 className="w-full p-2 transition duration-300 bg-white border border-gray-300 rounded-md shadow-sm resize-none dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                 rows={4}
                                 placeholder="Leave a comment..."
                                 value={newComment}
                                 onChange={handleOnChangeNewComment}
                              />
                           </div>
                        </div>
                        {newCommentError && (
                           <p className="mt-2 text-sm text-red-500">
                              {newCommentError}
                           </p>
                        )}
                        <div className="mt-2">
                           <button
                              type="button"
                              className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                              onClick={handlePostComment}>
                              Post Comment
                           </button>
                        </div>
                     </div>
                  ) : (
                     <p className="mb-4 text-gray-600 dark:text-gray-400">
                        <Link
                           to="/login"
                           className="text-blue-500 hover:underline focus:underline">
                           Log in
                        </Link>{" "}
                        or{" "}
                        <Link
                           to="/signup"
                           className="text-blue-500 hover:underline focus:underline">
                           sign up
                        </Link>{" "}
                        to leave a comment.
                     </p>
                  )}
                  <div className="space-y-4">
                     {comments.map((comment) => (
                        <div
                           key={comment.id}
                           className="flex items-start space-x-4">
                           <div className="relative flex-shrink-0">
                              <div className="w-10 h-10 overflow-hidden rounded-full md:w-12 md:h-12">
                                 {comment.user?.avatar_url ? (
                                    <img
                                       className="object-cover w-full h-full rounded-full"
                                       src={comment.user?.avatar_url}
                                       alt={`Profile of ${comment.user?.name}`}
                                    />
                                 ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-200 rounded-full">
                                       <User className="w-6 h-6" />
                                    </div>
                                 )}
                              </div>
                              {comment.user && (
                                 <div className="absolute bottom-0 right-0 flex items-center justify-center w-4 h-4 bg-green-500 border-2 border-white rounded-full">
                                    <svg
                                       className="w-2 h-2 text-white"
                                       fill="currentColor"
                                       viewBox="0 0 24 24">
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 13l4 4L19 7"
                                       />
                                    </svg>
                                 </div>
                              )}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                 {comment.user ? (
                                    <Link
                                       to={`/profile/${comment.user.id}`}
                                       className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:underline">
                                       {comment.user.name}
                                    </Link>
                                 ) : (
                                    <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                       Anonymous
                                    </span>
                                 )}
                                 <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDistanceToNow(
                                       new Date(comment.created_at)
                                    )}{" "}
                                    ago
                                 </p>
                              </div>
                              {isEditingComment &&
                              editingCommentId === comment.id ? (
                                 <div className="mb-2">
                                    <textarea
                                       className="w-full p-2 transition duration-300 bg-white border border-gray-300 rounded-md shadow-sm resize-none dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                       rows={2}
                                       value={editingComment}
                                       onChange={handleOnChangeEditingComment}
                                    />
                                    {editingCommentError && (
                                       <p className="mt-2 text-sm text-red-500">
                                          {editingCommentError}
                                       </p>
                                    )}
                                    <div className="mt-2">
                                       <button
                                          type="button"
                                          className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                                          onClick={() =>
                                             handleUpdateComment(comment.id)
                                          }>
                                          Save
                                       </button>{" "}
                                       <button
                                          type="button"
                                          className="px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
                                          onClick={handleCancelEditingComment}>
                                          Cancel
                                       </button>
                                    </div>
                                 </div>
                              ) : (
                                 <p className="mb-2 text-gray-600 dark:text-gray-400">
                                    {comment.content}
                                 </p>
                              )}
                              {user &&
                                 comment.user &&
                                 user.id === comment.user.id && (
                                    <div className="mb-2 space-x-2">
                                       <button
                                          type="button"
                                          className="text-blue-500 hover:underline focus:underline focus:outline-none"
                                          onClick={() =>
                                             handleEditComment(comment.id)
                                          }>
                                          Edit
                                       </button>{" "}
                                       <button
                                          type="button"
                                          className="text-red-500 hover:underline focus:underline focus:outline-none"
                                          onClick={() =>
                                             handleDeleteComment(comment.id)
                                          }>
                                          Delete
                                       </button>
                                    </div>
                                 )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         ) : (
            <div className="text-center">
               <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Post not found
               </p>
            </div>
         )}
      </div>
   );
};

export default PostDetails;
