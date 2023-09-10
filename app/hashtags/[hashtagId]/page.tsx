"use client";
import Category from "@/components/myComponents/global/Category";
import { useSingleHashtag } from "@/hooks/useFetchSingleHashtag";
import Navbar from "@/components/myComponents/global/Navbar";
import { useEffect, useState } from "react";

const page = () => {
   const [hashtagId, setHashtagId] = useState<string | null | undefined>(null);
   const [hashtagName, setHashtagName] = useState<string | null | undefined>(
      null
   );
   const url = window.location.pathname;
   const path = url.split("/")[2];
   const id = path;

   const { hashtag: hashtagData } = useSingleHashtag(id);

   useEffect(() => {
      setHashtagId(hashtagData?.id);
      setHashtagName(hashtagData?.name);
   }, [hashtagData]);

   return (
      <main>
         {" "}
         <Navbar />
         <section className="pt-24">
            {" "}
            <Category />
            <div>{hashtagId}</div>
            <div className="py-20 font-black ">{hashtagName}</div>
         </section>
      </main>
   );
};

export default page;
