"use client";

import { Button } from "@/components/ui/button";
import { useCategory } from "@/hooks/useCategory";
import { Plus } from "lucide-react";
import Link from "next/link";

const Category = () => {
   const { isError, isLoading, categories } = useCategory();
   // console.log(categories);
   return (
      <div className="flex items-center gap-6 px-6 py-4 overflow-x-auto border-b border-black/20">
         <div>
            <Plus />
         </div>
         {categories?.map((cat) => {
            const { name, id } = cat;
            return (
               <Link href={`/categories/${id}`} key={id}>
                  <Button className="px-2 py-2 transition-transform duration-300 rounded hover:scale-105 w-max whitespace-nowrap ">
                     {name}
                  </Button>
               </Link>
            );
         })}
      </div>
   );
};

export default Category;
