import { useAuth } from "@/hooks/useAuth";
import { useSignInDialogStore } from "@/hooks/useSignInDialog";
import supabase from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import CommentItem from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to comment.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  console.log(data);
  if (error) throw new Error(error.message);
  return data as Comment[];
};

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
  avatar_url: string;
  // extra properties for UI
  like?: number;
  isEdited?: boolean;
  children?: Comment[];
}

export const buildCommentTrees = (
  flatComments: Comment[],
  user: User | null
): Comment[] => {
  // Step 1: clone comments & add UI fields
  const map = new Map<number, Comment>();

  flatComments.forEach((c) => {
    map.set(c.id, {
      ...c,
      avatar_url: user?.user_metadata.avatar_url, // use avatar from user
      like: c.like ?? 0, // default like
      isEdited: c.isEdited ?? false, // default edit
      children: [],
    });
  });

  // Step 2: build tree
  const roots: Comment[] = [];

  map.forEach((comment) => {
    if (comment.parent_comment_id) {
      const parent = map.get(comment.parent_comment_id);
      if (parent) {
        parent.children!.push(comment);
      }
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

export const CommentSections = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("");

  const [expanded, setExpanded] = useState(false);
  const { openDialog } = useSignInDialogStore();

  const handleExpand = () => {
    if (!user) {
      // not logged in → show login dialog
      openDialog();
    } else {
      // logged in → expand textarea
      setExpanded(true);
    }
  };
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    // refetchInterval: 5000,
  });
  console.log(comments);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setExpanded(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;
    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };

  if (isLoading) {
    return <div> Loading comments...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const commentTrees = comments ? buildCommentTrees(comments, user) : [];

  console.log(commentTrees);
  return (
    <div className="mt-2">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>
      {/* Create Comment Section */}
      {!expanded ? (
        <div
          className="p-2 border rounded-2xl cursor-pointer hover:bg-muted/50 transition"
          onClick={handleExpand}
        >
          <p className="ml-2 text-gray-600">Join the conversation</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            placeholder="Write a comment..."
            rows={3}
          />
          <div className="flex gap-2 justify-end rounded-2xl">
            <Button
              onClick={() => {
                setExpanded(false);
              }}
              className="mt-2 bg-red-400 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="mt-2 bg-green-400 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              {isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
          {isError && (
            <p className="text-red-500 mt-2">Error posting comment.</p>
          )}
        </form>
      )}

      {/* Comments Display Section */}
      {commentTrees.length > 0 ? (
        <div className="space-y-2">
          {commentTrees.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 text-center mx-auto mt-10">
          <div className="">
            <img
              src="https://64.media.tumblr.com/805cea96d6e15b50db78b1f45133a72e/1b0039bb91761b56-3e/s2048x3072/cc6a49530dee6c29a78766f54104c9dc4f2e5d9b.jpg"
              className="mx-auto w-20 h-20   rounded-sm flex items-center justify-center"
              alt="first comment"
            />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold bg-gradient-to-r  bg-clip-text ">
              Be the first to comment this post
            </p>
            <div className="text-muted-foreground">
              Nobody's responded to this post yet. Add your thoughts and get the
              conversation going.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
