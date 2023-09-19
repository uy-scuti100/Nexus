import { Post } from "@/types";
import { X, PencilLine, Trash2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import supabase from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
   isEditable: boolean;
   handleIsEditable: (isEditable: boolean) => void;
   title: string;
   setTitle: (title: string) => void;
   content: string;
   setContent: (content: string) => void;
   snippet: string;
   setSnippet: (snippet: string) => void;
   tempTitle: string;
   setTempTitle: (tempTitle: string) => void;
   tempContent: string;
   setTempContent: (tempContent: string) => void;
   tempSnippet: string;
   setTempSnippet: (tempSnippet: string) => void;
   post: Post;
};

const CategoryAndEdit = ({
   isEditable,
   handleIsEditable,
   title,
   setTitle,
   setSnippet,
   content,
   snippet,
   tempTitle,
   tempSnippet,
   setTempSnippet,
   setTempTitle,
   setTempContent,
   post,
}: Props) => {
   const router = useRouter();
   const handleEnableEdit = () => {
      handleIsEditable(!isEditable);
      setTempTitle(title);
      setTempSnippet(snippet);
      setTempContent(content);
   };

   const handleCancelEdit = () => {
      handleIsEditable(!isEditable);
      setTitle(tempTitle);
      setSnippet(tempSnippet);
      setTempContent(content);
   };

   const { user } = useUser();

   const handleDelete = async () => {
      try {
         const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", post.id);
         if (!error) {
            toast.success("Post deleted successfully !");
         } else {
            toast.error("Failed to upodate Post");
            console.error("Error updating Post:", error);
         }
      } catch (error) {
         toast.error("Failed to delete !");
         console.error(error);
      } finally {
         router.push("/home");
      }
   };

   return (
      <div className="flex items-center justify-between">
         <h4 className="px-5 py-2 text-sm font-bold bg-accent-orange tex-wh-900">
            {post?.category_name}
         </h4>
         {post?.profile_id === user?.id && (
            <div className="mt-4">
               {isEditable ? (
                  <div className="flex justify-between gap-3">
                     <button onClick={handleCancelEdit}>
                        <X className="w-6 h-6 text-accent-red" />
                     </button>
                  </div>
               ) : (
                  <div className="flex items-center gap-8">
                     <button onClick={handleEnableEdit}>
                        <PencilLine className="w-6 h-6 text-accent-red" />
                     </button>
                     <Dialog>
                        <DialogTrigger>
                           <Trash2 className="w-6 h-6 text-red-700" />
                        </DialogTrigger>
                        <DialogContent>
                           <DialogHeader className="pt-5">
                              <DialogTitle>
                                 Are you sure absolutely sure you want to delete
                                 this post?
                              </DialogTitle>
                              <DialogDescription className="pt-3">
                                 This action cannot be undone. This will
                                 permanently delete your post and remove your
                                 post from our servers.
                              </DialogDescription>
                           </DialogHeader>
                           <DialogFooter className="pt-5">
                              <Button
                                 type="button"
                                 variant="destructive"
                                 onClick={handleDelete}>
                                 delete
                              </Button>
                           </DialogFooter>
                        </DialogContent>
                     </Dialog>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default CategoryAndEdit;
