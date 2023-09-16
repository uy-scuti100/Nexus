import { Post } from "@/types";
import { X, PencilLine } from "lucide-react";
import { useUser } from "@/hooks/useUser";

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
                  <button onClick={handleEnableEdit}>
                     <PencilLine className="w-6 h-6 text-accent-red" />
                  </button>
               )}
            </div>
         )}
      </div>
   );
};

export default CategoryAndEdit;
