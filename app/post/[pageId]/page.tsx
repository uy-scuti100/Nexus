"use client";
import Navbar from "@/components/myComponents/global/Navbar";
import Content from "./Content";
import Sidebar from "@/components/myComponents/global/Sidebar";
import { useFetchSinglePost } from "@/hooks/useFetchSinglePost";
import { usePathname } from "next/navigation";
import Write from "@/components/myComponents/global/Write";

const Post = () => {
   const pathname = usePathname();
   const id = pathname.split("/")[2];
   // console.log(id);
   const { post, isError, isLoading } = useFetchSinglePost(id);
   if (isLoading) {
      return <div>Loading</div>;
   }

   return (
      <main className="relative leading-7">
         <Navbar />
         <div className="gap-10 px-6 pt-32 mb-5 md:px-32">
            <div className="">
               <Content post={post} loading={isLoading} />
            </div>
         </div>
         <Write />
      </main>
   );
};

export default Post;
