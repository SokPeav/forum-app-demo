import useTreeTraverse from "@/hooks/useTraverseTree";
import InputComment from "./InputComment/InputComment";
import type { Comment } from "@/lib/config";
import CommentItem from "./CommentItem";
type CommentsProps = {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

const Comments = ({ comments, setComments }: CommentsProps) => {
  const { addComment, updateComment, deleteComment } = useTreeTraverse();

  const handleAddComment = (id: string, text: string) => {
    setComments((prevComments) => {
      return addComment([...prevComments], id, text);
    });
  };

  const handleUpdateComment = (id: string, comment: object) => {
    setComments((prevComments) => {
      return updateComment([...prevComments], id, comment);
    });
  };

  const handleDeleteComment = (id: string) => {
    setComments((prevComments) => {
      return deleteComment([...prevComments], id);
    });
  };

  return (
    <>
      {Array.isArray(comments) &&
        comments.length > 0 &&
        comments.map((data) => (
          <CommentItem
            key={data.id}
            comment={data}
            setComments={setComments}
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
