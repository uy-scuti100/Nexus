import React from "react";
import { BadgeCheck, Heart, HeartCrack } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { useFetchUser } from "@/hooks/useFetchUser";

function cn(...classes: string[]) {
   return classes.filter(Boolean).join(" ");
}

interface PostCardProp {
   author: string;
   id: string;
   image: string;
   snippet: string;
   author_verification: boolean;
   title: string;
   created_at: Date;
   category_name: string;
   author_image: string;
   bookmark_count: number;
   likes_count: number;
   comments_count: number;
}

const PostCard = ({
   author,
   id,
   image,
   snippet,
   author_verification,
   title,
   created_at,
   category_name,
   author_image,
   bookmark_count,
   likes_count,
   comments_count,
}: PostCardProp) => {
   const [isLoading, setLoading] = useState(true);
   const [bookmarkCount, setBookmarkCount] = useState(bookmark_count);
   const [likeCount, setLikeCount] = useState(likes_count);
   const [commentCount, setCommentCount] = useState(comments_count);
   const [isBookmarked, setIsBookmarked] = useState(false);
   const [isLiked, setIsLiked] = useState(false);
   const { user } = useFetchUser();
   const userId = user?.id;
   const postId = id;

   //    date formatting
   const date = new Date(created_at);
   const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
   } as any;
   const formattedDate = date.toLocaleDateString("en-US", options);

   //    check for bookmark based on user

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
   }, [postId, userId]);

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
         setLikeCount((prevCount) => prevCount - 1);
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
         setLikeCount((prevCount) => prevCount + 1);
      }
   };

   return (
      <div key={id} className="mb-10">
         <div className="relative w-full h-56 mb-6 md:h-96">
            <Image
               src={image}
               alt="post image"
               fill
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
         <div className="w-full px-6 border-b border-black/50 dark:border-white" />
         <Link href={`/post/${id}`}>
            <div className="py-4 text-2xl font-bold capitalize logo">
               {title}
            </div>
         </Link>
         <div className="w-full px-6 border-b border-black/50 dark:border-white" />
         <div className="flex items-center justify-between py-3 text-xs text-wh-300">
            <div className="flex items-center gap-3 capitalize">
               <Image
                  src={author_image}
                  width={24}
                  height={24}
                  alt="user-profile-img"
                  className="border border-accent w-[24px] h-[24px]  cursor-pointer"
               />
               <div className="flex items-center gap-2">
                  <p>{author} </p>
                  <span>
                     {author_verification && <BadgeCheck className="w-4 h-4" />}
                  </span>
               </div>
            </div>
            <div>{formattedDate}</div>
         </div>
         <div className="pt-3 pb-8 text-sm font-medium capitalize">
            {snippet}
         </div>
         <div className="flex items-center justify-between">
            <Badge variant="secondary">{category_name}</Badge>

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
                        fill="none"
                        // @ts-ignore
                        className="no">
                        <path
                           d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                           fill="currentcolor"></path>
                     </svg>
                  )}
               </button>
               <p>{bookmarkCount > 0 ? <p>{bookmarkCount}</p> : ""}</p>
            </div>
            <div className="flex items-center gap-1">
               <button onClick={toggleLike}>
                  {isLiked ? (
                     <Heart className="w-6 h-6" />
                  ) : (
                     <HeartCrack className="w-6 h-6" />
                  )}
               </button>
               <p>{likeCount > 0 ? <p>{likeCount}</p> : ""}</p>
            </div>
         </div>
      </div>
   );
};

export default PostCard;
