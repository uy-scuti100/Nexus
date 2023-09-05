import { TrendingUp } from "lucide-react";
import React from "react";
import { PostsProp, posts } from "../../constants/posts/posts";
import PostCard from "@/constants/posts/postCard";

export default function OnBoardTrendingPost() {
   return (
      <section className="pt-10">
         <div className="flex items-center px-6 gap-3 ">
            <span className="p-2 border border-b rounded-xl">
               <TrendingUp className="w-4 h-4 " />
            </span>
            Trending posts
         </div>
         <div className="grid md:grid-cols-2 lg:grid-cols-3 place-content-between gap-16 p-4">
            {posts.map((post: PostsProp) => {
               const { author, user_img, date, title } = post;
               return (
                  <PostCard
                     title={title}
                     date={date}
                     user_img={user_img}
                     author={author}
                  />
               );
            })}
         </div>
      </section>
   );
}
