"use client";
import { useUser } from "@/hooks/useUser";
import OnBoard from "@/components/myComponents/global/OnBoard";
import supabase from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import HashtagForm from "@/components/providers/modal/hashtag-modal";
import loadingPic from "../public/Fast loading.gif";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserHashtag {
   hashtag_id: string;
   hashtag_name: string;
}

const Page = () => {
   const [userHashtags, setUserHashtags] = useState<UserHashtag[]>([]);
   const [loadingUserHashtags, setLoadingUserHashtags] = useState(true);
   const [loading, setLoading] = useState(false);
   const [showHashtagForm, setShowHashtagForm] = useState(false);
   const { user, isError } = useUser();
   const userId = user?.id;
   const router = useRouter();

   useEffect(() => {
      const confirmUserHashtag = async () => {
         const { data: userHashtagsData, error } = await supabase
            .from("user_hashtags")
            .select("hashtag_id")
            .eq("user_id", userId);

         if (userHashtagsData) {
            setUserHashtags(userHashtagsData as UserHashtag[]);
            setLoadingUserHashtags(false);

            if (userHashtagsData.length < 5) {
               setShowHashtagForm(true);
            }
         }
      };
      if (userId) {
         confirmUserHashtag();
      }
   }, [userId]);

   useEffect(() => {
      const updateUserProfile = async () => {
         setLoading(true);
         try {
            if (userId) {
               const { data: userProfileData, error } = await supabase
                  .from("profiles")
                  .select()
                  .eq("id", userId)
                  .single();

               if (userProfileData) {
                  // Check if display_pic and display_name are null
                  if (
                     userProfileData.display_pic === null ||
                     userProfileData.display_name === null
                  ) {
                     // Update display_pic and display_name if they are null
                     await supabase
                        .from("profiles")
                        .update([
                           {
                              display_pic: user.avatarUrl,
                              display_name: user.fullName,
                           },
                        ])
                        .eq("id", userId)
                        .select();
                  }
               }
            }
            setLoading(false);
         } catch (error: any) {
            console.error("Error updating user profile:", error.message);
         }
      };

      if (userId && user) {
         updateUserProfile();
      }
   }, [userId, user]);

   useEffect(() => {
      if (user && userHashtags.length >= 5) {
         setLoading(false);
         router.push("/home");
      }
   }, [user, userHashtags, router]);

   if (isError) {
      return <main>Error loading user data</main>;
   }

   if (loading && loadingUserHashtags) {
      return (
         <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="relative w-full md:w-[500px] h-[500px]">
               <Image src={loadingPic} fill alt="loading-image" />
            </div>
         </div>
      );
   }

   if (showHashtagForm) {
      return <HashtagForm />;
   }

   return <OnBoard />;
};

export default Page;
