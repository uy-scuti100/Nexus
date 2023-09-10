"use client";
import Category from "@/components/myComponents/global/Category";
import Navbar from "@/components/myComponents/global/Navbar";
import RegistrationForm from "@/components/providers/modal/hashtag-modal";
import { useUser } from "@/hooks/useUser";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserHashtag {
   hashtag_id: string;
   hashtag_name: string;
}

interface HashtagProp {
   name: string | null | undefined;
   id: string | null | undefined;
}

const Page = () => {
   const [userHashtags, setUserHashtags] = useState<UserHashtag[]>([]);
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
      };
      confirmUserHashtag();
   }, [userId]);
   const hashtagCount = userHashtags?.length || 0;

   if (!hashtagCount) {
      return <RegistrationForm />;
   }

   return (
      <main>
         <Navbar />
         <section className="px-6 pt-24">
            <Category />
            {/* <div>
               {userHashtags.map((hashtag) => {
                  const { hashtag_id: id, hashtag_name: name } = hashtag;
                  return (
                     <Link href="/hasgtags/" key={id}>
                        {name}
                     </Link>
                  );
               })}
            </div> */}
         </section>
      </main>
   );
};

export default Page;
