"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import PostCard from "./PostCard";
import { motion } from "framer-motion";

interface PostCardProps {
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

const PAGE_COUNT = 5;
export default function TicketsPage() {
   const [posts, setPosts] = useState<PostCardProps[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [nextPage, setNextPage] = useState(1);
   const [NUM_TO_FETCH, setNUM_TO_FETCH] = useState(1);
   const [isFetching, setIsFetching] = useState(false);

   useEffect(() => {
      const fetchInitialPosts = async () => {
         try {
            const { data, error } = await supabase
               .from("posts")
               .select("*")
               .range(0, PAGE_COUNT - 1)
               .order("created_at", { ascending: false });

            if (!error && data) {
               setPosts(data);
            } else {
               setError("An error occurred while fetching posts.");
            }
         } catch (error) {
            setError("An error occurred while fetching posts.");
         }
      };

      fetchInitialPosts();
   }, []);

   // Fetch more posts
   const fetchMorePosts = async () => {
      if (isFetching) {
         return; // If already fetching, do nothing
      }

      setIsFetching(true);

      try {
         const from = nextPage * PAGE_COUNT; // Calculate the offset
         const to = from + PAGE_COUNT - 1;
         const { data, error } = await supabase
            .from("posts")
            .select("*")
            .range(from, to)
            .order("created_at", { ascending: true });

         if (!error) {
            if (data && data.length > 0) {
               setPosts((prevPosts) => [...prevPosts, ...data]);
               setNextPage((prev) => prev + 1);

               console.log("fetching from :", from);
               console.log("to", to);
               console.log(from);
            } else {
               setError("No more posts to fetch.");
            }
         } else {
            setError("An error occurred while fetching more posts.");
         }
      } catch (error) {
         setError("An error occurred while fetching more posts.");
      } finally {
         setIsFetching(false); // Set isFetching to false after fetching is complete
      }
   };

   // Load more posts when reaching the bottom
   useEffect(() => {
      const handleScroll = () => {
         if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
         ) {
            fetchMorePosts();
         }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <>
         <div className="flex flex-col w-full">
            {posts.map((post, index) => (
               <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                     duration: 0.4,
                     ease: [0.25, 0.25, 0, 1],
                     delay: index / 15, // Adjust the delay as needed
                  }}>
                  <>
                     <div>{index}</div>
                     <PostCard {...post} />
                  </>
               </motion.div>
            ))}

            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
         </div>
      </>
   );
}
