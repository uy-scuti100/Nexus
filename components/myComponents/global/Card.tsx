import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
   className?: string;
   post: Post;
   imageHeight: string;
   isSmallCard?: boolean;
   isLongForm?: boolean;
};

const Card = ({
   className,
   imageHeight,
   post,
   isSmallCard = false,
   isLongForm = false,
}: Props) => {
   const { id, title, author, created_at, image, snippet } = post || {};

   const date = new Date(created_at);
   const options = { year: "numeric", month: "long", day: "numeric" } as any;
   const formattedDate = date.toLocaleDateString("en-US", options);

   return (
      <div className={className}>
         <Link
            className="basis-full hover:opacity-70"
            href={`${process.env.NEXT_PUBLIC_URL}/post/${post?.id}`}>
            <div className={`relative w-auto mb-3 ${imageHeight}`}>
               <Image
                  fill
                  alt="tech"
                  placeholder="blur"
                  src={image}
                  sizes="(max-width: 480px) 100vw,
                  (max-width: 768px) 75vw,
                  (max-width: 1060px) 50vw,
                  33vw"
                  style={{ objectFit: "cover" }}
               />
            </div>
         </Link>
         <div className="basis-full">
            <Link href={`${process.env.NEXT_PUBLIC_URL}/post/${post?.id}`}>
               <h4
                  className={`font-bold hover:text-accent-green
            ${isSmallCard ? "text-base" : "text-lg"}
            ${isSmallCard ? "line-clamp-2" : ""}
          `}>
                  {title}
               </h4>
            </Link>

            <div className={`${isSmallCard ? "my-2" : "flex my-3"} gap-3`}>
               <h5 className="text-xs font-semibold">{author}</h5>
               <h6 className="text-xs text-wh-300">{formattedDate}</h6>
            </div>
            <p
               className={`text-wh-500 ${
                  isLongForm ? "line-clamp-5" : "line-clamp-3"
               }`}>
               {snippet}
            </p>
         </div>
      </div>
   );
};

export default Card;
