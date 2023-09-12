import { BadgeCheck, BookmarkPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Post } from "@/types";

const HomeCard = ({ blogPosts }: { blogPosts: Post[] | null | undefined }) => {
   return (
      <div className="flex flex-col w-full gap-5">
         {blogPosts?.map((post: Post, i: number) => {
            const {
               author,
               image,
               snippet,
               author_verification,
               title,
               created_at,
               category_name,
            } = post;
            const date = new Date(created_at);
            const options = {
               year: "numeric",
               month: "long",
               day: "numeric",
            } as any;
            const formattedDate = date.toLocaleDateString("en-US", options);
            return (
               <div key={i}>
                  <div className="relative w-full h-56 mb-6 md:h-96">
                     <Image
                        src={image}
                        alt="post image"
                        fill
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 85vw, (max-width: 1060px) 75vw, 60vw"
                        style={{ objectFit: "cover" }}
                     />
                  </div>
                  <div className="w-full px-6 border-b border-black/50 dark:border-white" />
                  <div className="py-4 text-2xl font-bold capitalize logo">
                     {title}
                  </div>
                  <div className="w-full px-6 border-b border-black/50 dark:border-white" />
                  <div className="flex justify-between py-3 text-xs text-wh-300">
                     <div className="flex items-center gap-3 capitalize">
                        <User className="w-4 h-4" />{" "}
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
                     <div>
                        <BookmarkPlus />
                     </div>
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default HomeCard;
