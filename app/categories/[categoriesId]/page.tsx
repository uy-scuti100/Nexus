"use client";
import Category from "@/components/myComponents/global/Category";
import Navbar from "@/components/myComponents/global/Navbar";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Subscribe from "@/components/myComponents/global/Subscribe";
import Sidebar from "@/components/myComponents/global/Sidebar";
import { Post } from "@/types";
import CategoryCard from "./CategoryCard";

const page = () => {
   const [categoryPosts, setCategoryPosts] = useState<
      Post[] | null | undefined
   >([]);
   const url = window.location.pathname;
   const path = url.split("/")[2];
   const id = path;

   useEffect(() => {
      // Check if we're on the server (Next.js server-side rendering)
      if (typeof window === "undefined") {
         // Perform server-side actions here if needed
      } else {
         // We're on the client side
         const fetchCategoryPosts = async () => {
            try {
               const { data: posts, error } = await supabase
                  .from("posts")
                  .select("*")
                  .eq("category_id", id);
               if (posts && !error) {
                  setCategoryPosts(posts);
               }
            } catch (error) {
               console.log(error);
            }
         };
         fetchCategoryPosts();
      }
   }, [id]);
   return (
      <main className="relative">
         <section className="pt-24">
            <div className="gap-10 px-6 pt-20 mb-5 md:flex">
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

export default page;
