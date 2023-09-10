"use client";
import Category from "@/components/myComponents/global/Category";
import Navbar from "@/components/myComponents/global/Navbar";
import { useSingleCategory } from "@/hooks/useFetchSingleCat";
import { useEffect, useState } from "react";

const page = () => {
   const [catId, setCatId] = useState<string | null | undefined>(null);
   const url = window.location.pathname;
   const path = url.split("/")[2];
   const id = path;

   const { category: categoryData } = useSingleCategory(id);

   useEffect(() => {
      // Set the catId from the cached category data
      setCatId(categoryData?.id);
   }, [categoryData]);

   return (
      <main>
         {" "}
         <Navbar />
         <section className="pt-24">
            {" "}
            <Category />
            <div>{catId}</div>
         </section>
      </main>
   );
};

export default page;
