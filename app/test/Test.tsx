"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import supabase from "@/lib/supabaseClient";
import PostCard from "../home/PostCard";
import Navbar from "@/components/myComponents/global/Navbar";
import Category from "@/components/myComponents/global/Category";

interface PostCardProp {
   author: string;
   id: string;
   image: string;
   snippet: string;
   author_verification: boolean;
   title: string;
   created_at: string;
   category_name: string;
   author_image: string;
   bookmark_count: number;
   likes_count: number;
   comment_count: number;
   profile_id: string;
}

export default function TicketsPage() {
   const PAGE_COUNT = 5;
   const containerRef = useRef<HTMLDivElement>(null);
   const [offset, setOffset] = useState<number>(1);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [posts, setPosts] = useState<PostCardProp[]>([]);
   const [error, setError] = useState<string | null>(null);

   const fetchInitialPosts = async () => {
      try {
         const { data, error } = await supabase
            .from("posts")
            .select("*")
            .range(0, PAGE_COUNT)
            .order("created_at", { ascending: false });

         if (!error && data) {
            setPosts(data);
            setError(null); // Clear any previous error
         } else {
            setError("An error occurred while fetching posts.");
         }
      } catch (error) {
         setError("An error occurred while fetching posts.");
      }
   };

   const fetchMorePosts = async (offset: number) => {
      setIsLoading(true);
      setOffset((prev) => prev + 1);
      const from = offset * PAGE_COUNT;
      const to = from + PAGE_COUNT - 1;

      try {
         const { data: newPosts } = await supabase
            .from("posts")
            .select("*")
            .range(from, to)
            .order("createdAt", { ascending: false });
         if (newPosts) {
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
         }
      } catch (error) {
         setError("An error occurred while fetching more posts.");
      }

      setIsLoading(false);
   };

   const handleScroll = () => {
      if (containerRef.current && typeof window !== "undefined") {
         const container = containerRef.current;
         const { bottom } = container.getBoundingClientRect();
         const { innerHeight } = window;
         const isInView = bottom <= innerHeight;

         if (isInView) {
            fetchMorePosts(offset);
         }
      }
   };

   useEffect(() => {
      // Attach the scroll event listener when the component mounts
      window.addEventListener("scroll", handleScroll);
      return () => {
         // Clean up the event listener when the component unmounts
         window.removeEventListener("scroll", handleScroll);
      };
   }, [offset]);

   useEffect(() => {
      // Fetch initial posts when the component mounts
      fetchInitialPosts();
   }, []);

   return (
      <>
         <Navbar />
         <div className="pt-24">
            <Category />
         </div>
         <div
            ref={containerRef}
            className="flex flex-col w-full gap-5 px-6 pt-10">
            {posts?.map((post, i: number) => {
               return (
                  <motion.div
                     key={post.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{
                        duration: 0.4,
                        ease: [0.25, 0.25, 0, 1],
                        delay: 0.2,
                     }}>
                     <PostCard {...post} />
                  </motion.div>
               );
            })}
         </div>
      </>
   );
}

// import React from "react";
// import TicketsPage from "./Test";

// type Props = {};

// const Page = (props: Props) => {
//    return <TicketsPage />;
// };

// export default Page;
