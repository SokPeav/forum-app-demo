import Comments from "./Comments";
import Actions from "./Actions";
import {
  MessageCircle,
  MessageCircleIcon,
  MessageSquare,
  UserCircle,
} from "lucide-react";
import InputComment from "./InputComment/InputComment";
import type { Comment } from "@/lib/config";
import Header from "./Header";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useState } from "react";

type CommentProps = {
  comment: Comment;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  handleAddComment: (id: string, text: string) => void;
  handleDeleteComment: (id: string) => void;
  handleUpdateComment: (id: string, comment: object) => void;
};

const CommentItem = ({
  comment,
  setComments,
  handleAddComment,
  handleDeleteComment,
  handleUpdateComment,
}: CommentProps) => {
  const [showPrevComment, setShowPrevComment] = useState(false);
  const prevCommentToggle = () => setShowPrevComment((prev) => !prev);

  const [showInput, setShowInput] = useState(false);
  const showInputToggle = () => setShowInput((prev) => !prev);

  const [isEditing, setIsEditing] = useState(false);
  const isEditingToggle = () => setIsEditing((prev) => !prev);

  const showPreviousReply = (comment: any) => {
    return comment.children && comment.children.length;
  };

  const handleEditComment = () => {
    isEditingToggle();
    showInputToggle();
  };

  return (
    <div className="flex my-5">
      <img
        src={"https://avatars.githubusercontent.com/u/39002531?v=4"}
        alt="User Avatar"
        className="w-[2rem] h-[2rem] rounded-full object-cover mr-3"
      />

      <div className="flex-1 flex-col space-y-1">
        <Header
          comment={comment}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
        />

        <p className="text-base">{comment.text}</p>

        <Actions
          id={comment.id}
          like={comment.like}
          showInput={showInputToggle}
          handleUpdateComment={handleUpdateComment}
        />

        {showInput && (
          <InputComment
            editCommentData={{
              isEditing,
              text: comment.text,
              isEditingToggle,
            }}
            id={comment.id}
            handleAddComment={handleAddComment}
            handleUpdateComment={handleUpdateComment}
            toggleInput={showInputToggle}
            prevCommentToggle={prevCommentToggle}
          />
        )}

        {!!showPreviousReply(comment) && (
          <Collapsible
            className="py-3 cursor-pointer"
            open={showPrevComment}
            onOpenChange={prevCommentToggle}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-3 ">
                <MessageSquare className="w-4 h-5" />
                <p className="text-sm hover:underline text-ring">{`${showPreviousReply(comment)} more reply`}</p>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {comment.children.map((child: any, idx: number) => {
                if (Array.isArray(child) && child.length) {
                  return (
                    <Comments
                      key={`tree-id: ${comment.id}-subtree: ${idx}`}
                      comments={child}
                      setComments={setComments}
                    />
                  );
                } else {
                  return (
                    <CommentItem
                      key={`tree-id: ${comment.id}-subtree: ${idx}`}
                      comment={child}
                      setComments={setComments}
                      handleAddComment={handleAddComment}
                      handleDeleteComment={handleDeleteComment}
                      handleUpdateComment={handleUpdateComment}
                    />
                  );
                }
              })}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
