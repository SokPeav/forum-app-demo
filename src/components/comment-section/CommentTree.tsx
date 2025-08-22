import {
  TreeProvider,
  TreeView,
  TreeNode,
  TreeNodeTrigger,
  TreeNodeContent,
  TreeExpander,
  TreeIcon,
  TreeLabel,
} from "@/components/ui/kibo-ui/tree"; // adjust path
import dayjs from "dayjs";

interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
  avatar_url: string;
  like?: number;
  isEdited?: boolean;
  children?: Comment[];
}
type CommentTreeProps = {
  comments: Comment[];
};

export const CommentTree: React.FC<CommentTreeProps> = ({ comments }) => {
  const renderNode = (comment: Comment, level = 0, isLast = false) => (
    <TreeNode
      key={comment.id}
      nodeId={comment.id.toString()}
      level={level}
      isLast={isLast}
    >
      {/* Node trigger (expand/collapse + label) */}
      <TreeNodeTrigger>
        <TreeExpander hasChildren={!!comment.children?.length} />
        <TreeIcon
          icon={
            <img
              src={comment.avatar_url}
              alt={comment.author}
              className="h-6 w-6 rounded-full"
            />
          }
        />
        <TreeLabel>
          <span className="font-medium">{comment.author}</span>{" "}
          <span className="text-xs text-gray-500">
            {dayjs(comment.created_at).fromNow()}
          </span>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {comment.content}
          </div>
        </TreeLabel>
      </TreeNodeTrigger>

      {/* Render children if expanded */}
      <TreeNodeContent hasChildren={!!comment.children?.length}>
        {comment.children?.map((child, i) =>
          renderNode(child, level + 1, i === comment.children!.length - 1)
        )}
      </TreeNodeContent>
    </TreeNode>
  );

  return (
    <TreeProvider defaultExpandedIds={[]} showLines indent={32}>
      <TreeView>
        {comments.map((c, i) => renderNode(c, 0, i === comments.length - 1))}
      </TreeView>
    </TreeProvider>
  );
};
