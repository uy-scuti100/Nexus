"use client";
import { Post } from "@/types";
import PostCard from "./PostCard";

const HomeCard = ({ blogPosts }: { blogPosts: Post[] | null | undefined }) => {
   return (
      <div className="flex flex-col w-full gap-5">
         {blogPosts?.map((post: Post) => {
            const {
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
            } = post;

            return (
               <PostCard
                  author={author}
                  id={id}
                  image={image}
                  snippet={snippet}
                  author_verification={author_verification}
                  title={title}
                  category_name={category_name}
                  author_image={author_image}
                  bookmark_count={bookmark_count}
                  created_at={created_at}
               />
            );
         })}
      </div>
   );
};

export default HomeCard;
