import { Post } from "@/types";
import Content from "./Content";
import Sidebar from "@/components/myComponents/global/Sidebar";

type Props = {
   params: { id: string };
};

export const revalidate = 60;

const getPost = async (id: string) => {
   const post: Post | null = await prisma.post.findUnique({
      where: { id },
   });

   if (!post) {
      console.log(`Post with id ${id} not found`);
      return null;
   }

   const formattedPost = {
      ...post,
      createdAt: post?.created_at?.toISOString(),
      updatedAt: post?.updated_at?.toISOString(),
   };

   return formattedPost;
};

const Post = async ({ params }: Props) => {
   const { id } = params;
   const post: Post | null = await getPost(id);

   if (!post) {
      return <div>Post Not Found</div>;
   }

   return (
      <main className="px-10 leading-7">
         <div className="gap-10 mb-5 md:flex">
            <div className="basis-3/4">
               <Content post={post} />
            </div>
            <div className="basis-1/4">
               <Sidebar />
               hey
            </div>
         </div>
      </main>
   );
};

export default Post;
