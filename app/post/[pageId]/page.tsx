"use client";
import Navbar from "@/components/myComponents/global/Navbar";
// import { Post } from "@/types";
import Content from "./Content";
import Sidebar from "@/components/myComponents/global/Sidebar";
import { useFetchSinglePost } from "@/hooks/useFetchSinglePost";
import { usePathname } from "next/navigation";

const Post = () => {
   const pathname = usePathname();
   const id = pathname.split("/")[2];
   // console.log(id);
   const { post, isError, isLoading } = useFetchSinglePost(id);
   if (isLoading) {
      return <div>Loading</div>;
   }

   return (
      <main className="leading-7">
         <Navbar />
         <div className="gap-10 px-6 pt-32 mb-5 md:flex">
            <div className="basis-3/4">
               <Content post={post} loading={isLoading} />
            </div>
            <div className="basis-1/4">
               <Sidebar type="home" />
            </div>
         </div>
      </main>
   );
};

export default Post;
