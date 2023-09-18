"use client";
import Hashtag from "@/components/myComponents/global/Hashtag";
import { useSingleHashtag } from "@/hooks/useFetchSingleHashtag";
import Navbar from "@/components/myComponents/global/Navbar";
import { useEffect, useState } from "react";

const Page = () => {
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
      <main className="px-6">
         {" "}
         <Navbar />
         <section className="pt-24">
            {" "}
            <Hashtag />
            <div>{hashtagId}</div>
            <div className="py-20 font-black ">{hashtagName}</div>
         </section>
      </main>
   );
};

export default Page;
