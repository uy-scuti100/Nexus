"use client";
import { useEffect, useState } from "react";
import Subscribe from "@/components/myComponents/global/Subscribe";
import Sidebar from "@/components/myComponents/global/Sidebar";
import { Post } from "@/types";
import CategoryCard from "./CategoryCard";
import { useFetchCategoryPost } from "@/hooks/useFetchCategoryPost";
import { useParams } from "next/navigation";

const Page = () => {
   const params = useParams();
   const paramsId = params.categoriesId;
   // console.log(paramsId);
   const { posts } = useFetchCategoryPost(paramsId as string);
   const [categoryPosts, setCategoryPosts] = useState<
      Post[] | null | undefined
   >([]);

   useEffect(() => {
      if (typeof window !== "undefined") {
         setCategoryPosts(posts);
      }
   }, [paramsId, posts]);
   return (
      <main className="relative">
         <section>
            <div className="gap-10 px-6 pt-10 mb-5 md:flex">
               <div className="basis-3/5">
                  {/* posts */}
                  <CategoryCard categoryPosts={categoryPosts} />
                  <div className="hidden md:block">
                     <Subscribe />
                  </div>
               </div>
               <div className="basis-2/5">
                  <Sidebar type="home" />
               </div>
            </div>
         </section>
      </main>
   );
};

export default Page;
