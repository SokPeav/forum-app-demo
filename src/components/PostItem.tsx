import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { LikeButton } from "./LikeButton";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group">
      {/* <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div> */}

      <div className="flex-1 h-full  bg-card border  text-card-foreground border-border rounded-3xl  flex-col p-2 overflow-hidden transition-colors duration-300 ">
        <Link
          to={`/post/$postId`}
          params={{ postId: post.id.toString() }}
          className="relative h-full z-10 "
        >
          {/* Header */}
          <div className="flex flex-col space-x-2 p-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div className="flex my-1 flex-1">
              <span className="text-[20px] leading-[22px] font-semibold mt-2">
                {post.title}
              </span>
            </div>
          </div>

          {/* Image */}
          <div className="pointer-events-none relative flex-1 ">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full   mt-2 rounded-lg object-contain"
            />
          </div>
        </Link>

        {/* Controls outside the Link */}
        <div className="flex justify-between items-center">
          <LikeButton postId={post.id} />
          <Link
            to={`/post/$postId`}
            params={{ postId: post.id.toString() }}
            className="p-2 flex items-center rounded-full  gap-1"
          >
            <MessageCircle size={14} />
            <span>{post.comment_count ?? 0}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
