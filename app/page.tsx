"use client";
import { useUser } from "@/hooks/useUser";
import OnBoard from "@/components/myComponents/global/OnBoard";
import supabase from "@/lib/supabaseClient";
import { useEffect } from "react";
import loading from "../public/Fast loading.gif";
import Image from "next/image";

const Page = () => {
   const { user, isLoading, isError } = useUser();
   const userId = user?.id;

   useEffect(() => {
      if (typeof window === "undefined") {
         // Perform server-side actions here if needed
      } else {
         const updateUserProfile = async () => {
            try {
               const { data, error } = await supabase
                  .from("profiles")
                  .update({
                     display_pic: user?.avatarUrl,
                     display_name: user?.fullName,
                  })
                  .eq("id", userId);

               if (error) {
                  console.error("Error updating user profile:", error.message);
               } else {
                  console.log("User profile updated successfully:", data);
               }
            } catch (error: any) {
               console.error("Error updating user profile:", error.message);
            }
         };
         updateUserProfile();
      }
   }, []);

   if (isLoading) {
      return (
         <div className="fixed inset-0 flex items-center justify-center bg-white ">
            <div className="relative w-full md:w-[500px] h-[500px]">
               <Image src={loading} fill alt="loading-image" />
            </div>
         </div>
      );
   }

   if (isError) {
      return <main>Error loading user data</main>;
   }

   if (!user) {
      return <OnBoard />;
   }
   if (user) {
      window.location.href = "/home";
   }

   return null;
};

export default Page;
