"use client";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/hooks/useCategory";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Category: any = () => {
   const { isError, isLoading, categories } = useCategory();
   const [currentPath, setCurrentPath] = useState<string | null>(null);

   useEffect(() => {
      // Get the current path from the window location
      const url = window.location.pathname;
      const path = url.split("/")[2];
      setCurrentPath(path);
   }, []); // This effect runs once when the component mounts

   return (
      <div className="flex items-center gap-6 px-6 py-4 overflow-x-auto border-b pt-28 border-black/20">
         <div>
            <Plus />
         </div>
         {categories?.map((cat) => {
            const { name, id } = cat;

            return (
               <Link href={`/categories/${id}`} key={id}>
                  <Button
                     className={`${
                        currentPath === id && "bg-accent-red"
                     } px-2 py-2 transition-transform duration-300 rounded hover:scale-105 w-max whitespace-nowrap`}>
                     {name}
                  </Button>
               </Link>
            );
         })}
      </div>
   );
};

export default Category;
