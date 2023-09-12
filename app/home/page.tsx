"use client";
import Category from "@/components/myComponents/global/Category";
import Navbar from "@/components/myComponents/global/Navbar";
import HashtagForm from "@/components/providers/modal/hashtag-modal";
import { usePost } from "@/hooks/usePost";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Subscribe from "@/components/myComponents/global/Subscribe";
import Sidebar from "@/components/myComponents/global/Sidebar";
import HomeCard from "./HomeCard";

interface UserHashtag {
   hashtag_id: string;
   hashtag_name: string;
}

const Page = () => {
   const [userHashtags, setUserHashtags] = useState<UserHashtag[]>([]);

   const [isLoading, setIsLoading] = useState(true);
   const { user } = useUser();
   const userId = user?.id;

   useEffect(() => {
      const confirmUserHashtag = async () => {
         const { data: userHashtagsData, error } = await supabase
            .from("user_hashtags")
            .select("hashtag_id")
            .eq("user_id", userId);

         if (userHashtagsData) {
            setUserHashtags(userHashtagsData as UserHashtag[]);
         }

         // Set loading state to false once data is fetched
         setIsLoading(false);
      };
      confirmUserHashtag();
   }, [userId]);

   const { posts: blogPosts } = usePost();

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (userHashtags.length < 5) {
      return <HashtagForm />;
   }

   return (
      <main className="relative">
         <Navbar />
         <section className="px-6 pt-24">
            <Category />
            <div className="gap-10 pt-20 mb-5 md:flex">
               <div className="basis-3/5">
                  {/* posts */}
                  <HomeCard blogPosts={blogPosts} />
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
