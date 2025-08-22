import useTreeTraverse from "@/hooks/useTraverseTree";
import InputComment from "./InputComment/InputComment";
import type { Comment } from "@/lib/config";
import CommentItem from "./CommentItem";
type CommentsProps = {
  comments: Comment[];
};

const Comments = ({ comments }: CommentsProps) => {
  const { addComment, updateComment, deleteComment } = useTreeTraverse();

  const handleAddComment = (id: string, text: string) => {
   
  };

  const handleUpdateComment = (id: string, comment: object) => {
  
  };

  const handleDeleteComment = (id: string) => {
  
  };

  return (
    <>
      {Array.isArray(comments) &&
        comments.length > 0 &&
        comments.map((data) => (
          <CommentItem
            key={data.id}
            comment={data}
            handleAddComment={handleAddComment}
            handleDeleteComment={handleDeleteComment}
            handleUpdateComment={handleUpdateComment}
          />
        ))}

      {/* <InputComment
        handleAddComment={handleAddComment}
        handleUpdateComment={handleUpdateComment}
      /> */}
    </>
  );
};

export default Comments;
