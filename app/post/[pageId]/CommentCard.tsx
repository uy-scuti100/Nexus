"use client";
import { Textarea } from "@/components/ui/textarea";
import { useFetchUser } from "@/hooks/useFetchUser";
import supabase from "@/lib/supabaseClient";
import { Comment } from "@/types";
import { Edit, MessageCircle, Reply, Trash } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type CachedReplies = Record<string, Comment[]>;

// const cachedReplies: CachedReplies = {};

const CommentCard = ({
   comment,
   isChild,
}: {
   comment: Comment;
   isChild?: boolean;
}) => {
   const [isLiked, setIsLiked] = useState(false);
   const [showReplyForm, setShowReplyForm] = useState(false);
   const [commentCount, setCommentcount] = useState(comment?.comment_count);
   const [newReplies, setNewReplies] = useState<Comment[]>([]);
   const [likeCount, setLikeCount] = useState(comment?.likes_count);
   const [replyContent, setReplyContent] = useState("");
   const [replies, setReplies] = useState<Comment[]>([]);
   const { theme } = useTheme();
   const { user } = useFetchUser();
   const userId = user?.id;
   const commentId = comment?.id;

   const handleReplySubmit = async (e: any) => {
      e.preventDefault();

      try {
         // Make an API request to insert the new reply into the 'comments' table
         const { data, error } = await supabase.from("comments").upsert([
            {
               content: replyContent,
               parent_comment_id: comment.id,
               profile_id: userId,
            },
         ]);

         if (error) {
            // Handle the error, e.g., display an error message to the user.
            console.error("Error inserting reply:", error.message);
         } else {
            // The reply has been successfully inserted.
            // You can handle the success, e.g., by updating your UI to display the new reply.

            if (data !== null) {
               setReplies((prevReplies) => [...prevReplies, data[0]]);
            }

            setReplyContent("");
            toast.success("reply sent");
            setShowReplyForm(false);
         }
      } catch (error) {
         // Handle any unexpected errors that may occur during the API request.
         console.error("API request error:", error);
      }
   };

   const toggleReplyForm = () => {
      setShowReplyForm(!showReplyForm);
   };
   // Check if the user has liked the post

   const checkLikeStatus = async () => {
      if (commentId && userId) {
         const { data, error } = await supabase
            .from("comment_likes")
            .select("*")
            .eq("profile_id", userId)
            .eq("comment_id", commentId);

         if (data && data.length > 0) {
            setIsLiked(true);
         }
      }
   };

   useEffect(() => {
      checkLikeStatus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [commentId, userId]);

   const toggleLike = async () => {
      if (isLiked) {
         // Remove the like
         await supabase
            .from("comment_likes")
            .delete()
            .eq("profile_id", userId)
            .eq("comment_id", commentId);

         setIsLiked(false);
         // Decrement the like_count (if you have it)
         setLikeCount((prevCount: number): number => prevCount - 1);
      } else {
         // Add the like
         await supabase.from("comment_likes").insert([
            {
               profile_id: userId,
               comment_id: commentId,
            },
         ]);

         setIsLiked(true);
         // Increment the like_count (if you have it)
         setLikeCount((prevCount: number): number => prevCount + 1);
      }
   };
   useEffect(() => {
      const fetchReplies = async () => {
         const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("parent_comment_id", comment.id);

         if (error) {
            console.error("Error fetching replies:", error.message);
         } else {
            setReplies(data);
         }
      };

      fetchReplies();
   }, [comment]);

   const [areChildrenHidden, setAreChildrenHidden] = useState(true);
   return (
      <>
         <div className="pb-3 mb-4">
            <div className="p-4 border rounded-xl ">
               <div key={comment.id} className="flex items-start gap-3 pb-4">
                  <Image
                     src={comment?.comment_author_pic}
                     alt="Comment Author"
                     className="w-12 h-12 rounded-full"
                     width={48}
                     height={48}
                  />
                  <div className="flex flex-col">
                     <div className="flex items-center mb-1">
                        <p className="font-semibold">
                           {comment?.comment_author_name}
                        </p>
                     </div>
                     <p className="p-2 rounded-md bg-input">
                        {comment?.content}
                     </p>
                  </div>
               </div>
               <div className="flex items-center justify-end gap-5">
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
                              color="rgb(255, 48, 64)"
                              fill="rgb(225, 225, 225)"
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
                  <div
                     className="flex items-center gap-1 cursor-pointer"
                     onClick={toggleReplyForm}>
                     <Reply className="w-6 h-6 opacity-70" />
                     <p>{commentCount > 0 ? <p>{commentCount}</p> : ""}</p>
                  </div>
                  {comment.profile_id === userId && (
                     <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={toggleReplyForm}>
                        <Edit className="w-6 h-6 opacity-70" />
                     </div>
                  )}

                  {comment.profile_id === userId && (
                     <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={toggleReplyForm}>
                        <Trash className="w-6 h-6 text-red-600 opacity-70" />
                     </div>
                  )}
               </div>
            </div>
            {showReplyForm && (
               <div className="pl-8 mt-4">
                  <Textarea
                     placeholder="Reply to this comment..."
                     style={{
                        height: "100px",
                        resize: "none",
                     }}
                     value={replyContent}
                     onChange={(e) => setReplyContent(e.target.value)}
                  />

                  <div className="flex justify-end">
                     <button
                        type="submit"
                        className="px-5 py-2 mt-5 font-semibold bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black"
                        onClick={handleReplySubmit}>
                        Post Reply
                     </button>
                  </div>
               </div>
            )}
         </div>
         {replies?.length > 0 && (
            <>
               <div className={`flex ${areChildrenHidden ? "hidden" : ""}`}>
                  <button
                     className="collapse-line"
                     aria-label="Hide Replies"
                     onClick={() => setAreChildrenHidden(true)}
                  />
                  <div className="pl-[0.5rem] flex-grow">
                     {replies.map((reply) => (
                        <CommentCard key={reply.id} comment={reply} />
                     ))}
                  </div>
               </div>
               {areChildrenHidden && (
                  <button
                     className="px-5 py-2 my-5 font-semibold bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black"
                     onClick={() => setAreChildrenHidden(false)}>
                     Show replies
                  </button>
               )}
            </>
         )}
      </>
   );
};

export default CommentCard;
