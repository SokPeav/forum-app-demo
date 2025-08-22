import { useAuth } from "@/hooks/useAuth";
import supabase from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  MinusIcon,
  MoreHorizontal,
  PlusIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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
type CommentItemProps = {
  comment: Comment;
  depth?: number;
  postId: number;
};
const threadColors = [
  { light: "stroke-blue-400", dark: "dark:stroke-blue-300" },
  { light: "stroke-purple-400", dark: "dark:stroke-purple-300" },
  { light: "stroke-green-400", dark: "dark:stroke-green-300" },
  { light: "stroke-orange-400", dark: "dark:stroke-orange-300" },
  { light: "stroke-pink-400", dark: "dark:stroke-pink-300" },
];

const getThreadColor = (depth: number) => {
  const colorSet = threadColors[
    Math.min(depth - 1, threadColors.length - 1)
  ] || {
    light: "stroke-gray-400",
    dark: "dark:stroke-gray-500",
  };
  return `${colorSet.light} ${colorSet.dark}`;
};

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth = 0,
  postId,
}) => {
  const [replyText, setReplyText] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [childPositions, setChildPositions] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasChildren = comment.children && comment.children.length > 0;
  const lineOffset = collapsed ? 40 : 80;

  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    const positions = comment.children?.map((child) => {
      const el = document.getElementById(`avatar-${child.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        return rect.top - container.top + rect.height / 2;
      }
      return 0;
    });

    setChildPositions(positions ?? []);
  }, [comment, collapsed, showReplyForm, hasChildren /* childPositions */]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReplyForm(false);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };

  return (
    <div
      className="relative"
      ref={containerRef}
      data-collapsed={collapsed ? "true" : "false"}
    >
      {/* Main comment container */}
      <div className="flex py-3">
        <div className="flex flex-1">
          {/* Avatar */}
          <div id={`avatar-${comment.id}`} className="flex-shrink-0 mr-3">
            <img
              src={comment.avatar_url}
              alt={`${comment.author}'s avatar`}
              className={cn(
                "w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm relative z-20",
                collapsed && "opacity-0"
              )}
            />
          </div>

          <div className="flex-1 min-w-0 items-center justify-center align-middle">
            <div className="flex items-center align-middle mt-2 space-x-2 mb-2 ">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm ">
                {comment.author}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                •
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                <span className="mr-2 text-[0.7rem] text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: false,
                  })}
                </span>
              </span>
            </div>
            {!collapsed && (
              <>
                <div className="prose prose-sm max-w-none mb-3">
                  <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <button
                    className={cn(
                      "flex items-center space-x-1 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    )}
                  >
                    <Heart size={14} className={"fill-current"} />
                  </button>

                  <button
                    onClick={() => setShowReplyForm((prev) => !prev)}
                    className="flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle size={14} />
                    <span>Reply</span>
                  </button>

                  <button className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                  <div className="mb-4">
                    <form onSubmit={handleReplySubmit} className="mb-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => setShowReplyForm(false)}
                          className="px-3 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-2 px-3 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                          {isPending ? "Posting..." : "Post Reply"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Thread lines */}
      {/* {hasChildren && (
        <div
          className="absolute left-4 pointer-events-none"
          style={{ top: "16px" }}
        >
          <svg width="200" className="overflow-visible">
            <line
              onClick={() => setCollapsed(!collapsed)}
              style={{ cursor: "pointer", pointerEvents: "stroke" }} // <-- important
              x1="0"
              y1="24"
              x2="0"
              y2={
                collapsed
                  ? 0
                  : (childPositions[childPositions.length - 1] ?? 0) -
                    lineOffset
              }
              stroke="transparent" // invisible, just for clicking
              pointerEvents="stroke"
              className={`${getThreadColor(1)} stroke-2`}
              strokeOpacity="0.6"
            />

            {!collapsed &&
              childPositions.map((y, i) => (
                <path
                  key={i}
                  d={`M 0 ${y - lineOffset} Q 0 ${y - (lineOffset - 30)} 32 ${y - (lineOffset - 30)}`}
                  className={`${getThreadColor(depth)} stroke-2`}
                  strokeOpacity="0.6"
                />
              ))}
          </svg>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              `absolute -left-[12px] w-6 h-6 rounded-full border ${getThreadColor(depth + 1)}
               bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center
               text-xs transition-all duration-200 shadow-sm hover:shadow-md z-30 pointer-events-auto`,
              collapsed ? "top-[0]" : "top-[61px]"
            )}
          >
            {collapsed ? (
              <PlusIcon
                size={12}
                className="text-gray-600 dark:text-gray-300"
              />
            ) : (
              <MinusIcon
                size={12}
                className="text-gray-600 dark:text-gray-300"
              />
            )}
          </button>
        </div>
      )} */}

      {hasChildren && (
        <div
          className="absolute left-4 pointer-events-none bg-border"
          style={{ top: "16px" }}
        >
          {/* Vertical line */}
          <div
            className={cn(
              "absolute left-0 w-[3px] bg-border cursor-pointer transition-all",

              getThreadColor(depth)
            )}
            style={{
              top: "24px",
              height: collapsed
                ? "0px"
                : `${(childPositions[childPositions.length - 1] ?? 0) - lineOffset}px`,
            }}
          />

          {/* Curved connectors */}
          {!collapsed &&
            childPositions.map((y) => (
              <div
                key={y}
                className={cn(
                  "absolute w-7 h-10 border-border border-l-[3px] border-l-border  border-b-3 transition-all  rounded-bl-[12px] ",
                  getThreadColor(depth) // 👈 apply your color classes here
                )}
                style={{
                  top: `${y - 85}px`,
                  left: "0px",
                }}
              />
            ))}
          {/* Collapse/Expand button */}
          {/* TODO: Seem it break UI will came do later */}
          {/* <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              `absolute -left-[12px] w-6 h-6 rounded-full border ${getThreadColor(
                depth + 1
              )}
         bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center
         text-xs transition-all duration-200 shadow-sm hover:shadow-md z-30 pointer-events-auto`,
              collapsed ? "top-[0]" : "top-[61px]"
            )}
          >
            {collapsed ? (
              <PlusIcon
                size={12}
                className="text-gray-600 dark:text-gray-300"
              />
            ) : (
              <MinusIcon
                size={12}
                className="text-gray-600 dark:text-gray-300"
              />
            )}
          </button> */}
        </div>
      )}

      {hasChildren && !collapsed && (
        <div className="ml-12 relative">
          {comment.children?.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              depth={depth + 1}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
