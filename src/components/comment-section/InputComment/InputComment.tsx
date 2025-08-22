import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
type InputProps = {
  id?: number | string;
  editCommentData?: {
    isEditing: boolean;
    text: string;
    isEditingToggle: () => void;
  };
  handleAddComment: (id: string, text: string) => void;
  handleUpdateComment: (id: string, comment: object) => void;
  toggleInput?: () => void;
  prevCommentToggle?: () => void;
};

const InputComment = ({
  id,
  editCommentData,
  handleAddComment,
  handleUpdateComment,
  toggleInput,
  prevCommentToggle,
}: InputProps) => {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (editCommentData?.isEditing && editCommentData?.text)
      setComment(editCommentData?.text);
  }, []);

  const handleAdd = () => {
    // //add comment
    // if (!id) return;
    // if (editCommentData?.isEditing && comment !== editCommentData.text) {
    //   handleUpdateComment(id, { text: comment, isEdited: true });
    // } else {
    //   handleAddComment(id, comment);
    // }
    // editCommentData?.isEditingToggle();
    // setComment("");
    // if (toggleInput) toggleInput();
    // if (prevCommentToggle && !editCommentData?.isEditing) prevCommentToggle();
  };

  return (
    <>
      <div className="flex w-full">
        <img
          src={"https://avatars.githubusercontent.com/u/39002531?v=4"}
          alt="User Avatar"
          className="w-[2rem] h-[2rem] rounded-full object-cover mr-3"
        />
        <Input
          className="w-full flex-1"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="write a comment..."
        />
      </div>
      {!!comment.length && (
        <MessageCircle />
        // <Icon
        //   right
        //   text="Add Comment"
        //   onClick={handleAdd}
        //   disabled={comment.length < 5}
        //   icon={<MessageCircle size="1.4rem" />}
        // />
      )}
    </>
  );
};

export default InputComment;
