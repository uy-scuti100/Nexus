import React from "react";
import {
   LargePostsProp,
   PostsProp,
   largePosts,
   posts,
} from "../../constants/posts/posts";
import PostCard from "@/constants/posts/postCard";
import LargePostCard from "@/constants/posts/largePostCard";

export const TrendingPostComponent = () => {
   return (
      <div className="grid gap-16 px-6 py-8 md:grid-cols-2 lg:grid-cols-3 place-content-between">
         {posts.map((post: PostsProp, i: number) => {
            const { author, user_img, date, title, verified } = post;
            const postNumber = (i + 1).toString().padStart(2, "0");
            return (
               <div key={i} className="flex gap-5">
                  <span className="font-bold text-2xl text-foreground/30 font-[miracle] mt-5">
                     {postNumber}
                  </span>
                  <PostCard
                     title={title}
                     date={date}
                     user_img={user_img}
                     author={author}
                     verified={verified}
                  />
               </div>
            );
         })}
      </div>
   );
};

export const LargePostComponent = () => {
   return (
      <div className="px-6 py-8 ">
         {largePosts.map((post: LargePostsProp, i: number) => {
            const { author, user_img, date, title, verified, post_image } =
               post;
            // const postNumber = (i + 1).toString().padStart(2, "0");
            return (
               <div key={i} className="w-full pb-6">
                  {/* <span className="font-bold text-2xl text-foreground/30 font-[miracle] mt-5">
                     {postNumber}
                  </span> */}
                  <LargePostCard
                     title={title}
                     date={date}
                     user_img={user_img}
                     author={author}
                     verified={verified}
                     post_image={post_image}
                  />
               </div>
            );
         })}
      </div>
   );
};
