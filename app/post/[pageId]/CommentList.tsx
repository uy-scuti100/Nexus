import Image from "next/image";
import React from "react";
import CommentCard from "./CommentCard";
import { Comment } from "@/types";

interface CommentListProps {
   comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({
   comments,
}: CommentListProps) => {
   return (
      <div>
         {comments.map((comment) => (
            <CommentCard comment={comment} />
         ))}
      </div>
   );
};

export default CommentList;
