import Image from "next/image";
import { PostsProp } from "./posts";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

const PostCard: React.FC<PostsProp> = ({
   author,
   user_img,
   title,
   date,
   verified,
}: PostsProp) => {
   return (
      <Link href="/">
         <div className="border-b px-4 py-4 rounded-xl border w-fit">
            <div className="flex items-center gap-3">
               <Image
                  src={user_img}
                  height={20}
                  width={20}
                  alt="author-img"
                  className="object-cover w-5 h-5 "
               />
               <div>{author}</div>
               {verified ? <BadgeCheck className="h-4 w-4" /> : ""}
            </div>
            <h1 className="text-xl font-bold py-3">{title}</h1>

            <p className="text-sm text-foreground/50">{date}</p>
         </div>
      </Link>
   );
};

export default PostCard;
