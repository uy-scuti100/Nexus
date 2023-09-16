"use client";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Post } from "@/types";
import Link from "next/link";
import { useState } from "react";

function cn(...classes: string[]) {
   return classes.filter(Boolean).join(" ");
}
const HomeCard = ({ blogPosts }: { blogPosts: Post[] | null | undefined }) => {
   const [isLoading, setLoading] = useState(true);
   return (
      <div className="flex flex-col w-full gap-5">
         {blogPosts?.map((post: Post, i: number) => {
            const {
               author,
               id,
               image,
               snippet,
               author_verification,
               title,
               created_at,
               category_name,
               author_image,
            } = post;
            const date = new Date(created_at);
            const options = {
               year: "numeric",
               month: "long",
               day: "numeric",
            } as any;
            const formattedDate = date.toLocaleDateString("en-US", options);
            return (
               <div key={id}>
                  <div className="relative w-full h-56 mb-6 md:h-96">
                     <Image
                        src={image}
                        alt="post image"
                        fill
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 85vw, (max-width: 1060px) 75vw, 60vw"
                        style={{ objectFit: "cover" }}
                        className={cn(
                           "duration-700 ease-in-out",
                           isLoading
                              ? "grayscale blur-2xl scale-110"
                              : "grayscale-0 blur-0 scale-100"
                        )}
                        onLoadingComplete={() => setLoading(false)}
                     />
                  </div>
                  <div className="w-full px-6 border-b border-black/50 dark:border-white" />
                  <Link href={`/post/${id}`}>
                     <div className="py-4 text-2xl font-bold capitalize logo">
                        {title}
                     </div>
                  </Link>
                  <div className="w-full px-6 border-b border-black/50 dark:border-white" />
                  <div className="flex items-center justify-between py-3 text-xs text-wh-300">
                     <div className="flex items-center gap-3 capitalize">
                        <Image
                           src={author_image}
                           width={24}
                           height={24}
                           alt="user-profile-img"
                           className="border border-accent w-[24px] h-[24px]  cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                           <p>{author} </p>
                           <span>
                              {author_verification && (
                                 <BadgeCheck className="w-4 h-4" />
                              )}
                           </span>
                        </div>
                     </div>
                     <div>{formattedDate}</div>
                  </div>
                  <div className="pt-3 pb-8 text-sm font-medium capitalize">
                     {snippet}
                  </div>
                  <div className="flex items-center justify-between">
                     <Badge variant="secondary">{category_name}</Badge>
                     <div className="flex gap-2 items-centercursor-pointer">
                        <svg
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                           fill="none"
                           // @ts-ignore
                           class="ut">
                           <path
                              d="M7.5 3.75a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-14a2 2 0 0 0-2-2h-9z"
                              fill="currentcolor"></path>
                        </svg>
                        <svg
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                           fill="none"
                           // @ts-ignore
                           class="no">
                           <path
                              d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                              fill="currentcolor"></path>
                        </svg>
                     </div>
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default HomeCard;
