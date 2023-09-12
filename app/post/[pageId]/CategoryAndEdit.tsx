import { Editor } from "@tiptap/react";
import { X, PencilLine } from "lucide-react";

interface PostProp {
   title: string;
   category_name: string;
}

type Props = {
   isEditable: boolean;
   handleIsEditable: (isEditable: boolean) => void;
   title: string;
   setTitle: (title: string) => void;
   tempTitle: string;
   setTempTitle: (tempTitle: string) => void;
   tempContent: string;
   setTempContent: (tempContent: string) => void;
   editor: Editor | null;
   post: PostProp;
};

const CategoryAndEdit = ({
   isEditable,
   handleIsEditable,
   title,
   setTitle,
   tempTitle,
   setTempTitle,
   tempContent,
   setTempContent,
   editor,
   post,
}: Props) => {
   const handleEnableEdit = () => {
      handleIsEditable(!isEditable);
      setTempTitle(title);
      setTempContent(editor?.getHTML() || "");
   };

   const handleCancelEdit = () => {
      handleIsEditable(!isEditable);
      setTitle(tempTitle);
      editor?.commands.setContent(tempContent);
   };

   return (
      <div className="flex items-center justify-between">
         <h4 className="px-5 py-2 text-sm font-bold bg-accent-orange tex-wh-900">
            {post.category_name}
         </h4>
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
      </div>
   );
};

export default CategoryAndEdit;
