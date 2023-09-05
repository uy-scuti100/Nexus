import Image from "next/image";
import { PostsProp } from "./posts";

const PostCard: React.FC<PostsProp> = ({
   author,
   user_img,
   title,
   date,
}: PostsProp) => {
   return (
      <div className="border-b px-4 py-4 rounded-xl border w-fit">
         <div className="flex items-center gap-3">
            <Image
               src={user_img}
               height={36}
               width={36}
               alt="author-img"
               className="rounded-full object-cover w-9 h-9 "
            />
            <div>{author}</div>
         </div>
         <h1 className="text-xl font-bold py-3">{title}</h1>

         <p className="text-sm text-foreground/50">{date}</p>
      </div>
   );
};

export default PostCard;
