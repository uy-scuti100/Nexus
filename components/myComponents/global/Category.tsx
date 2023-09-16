"use client";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/hooks/useCategory";
import { Plus } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

const Category = () => {
   const { isError, isLoading, categories } = useCategory();
   const params = useParams();
   const paramsId = params.categoriesId;
   const pathname = usePathname();
   const path = pathname.split("/")[1];
   // console.log(pathname);

   return (
      <div className="flex items-center gap-6 px-6 py-4 overflow-x-auto border-b border-black/20">
         <div>
            <Plus />
         </div>
         <Link href="/home">
            <Button
               className={` ${
                  path === "home" && "bg-accent-orange"
               } px-2 py-2 transition-transform duration-300 rounded hover:scale-105 w-max whitespace-nowrap`}>
               {" "}
               For You
            </Button>
         </Link>
         {categories?.map((cat) => {
            const { name, id } = cat;
            return (
               <Link href={`/categories/${id}`} key={id}>
                  <Button
                     className={`${
                        paramsId === id && "bg-accent-orange"
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
