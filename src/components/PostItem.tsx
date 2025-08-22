import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { LikeButton } from "./LikeButton";
import type { Post } from "./PostList";
import { useCallback, useRef } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    // We need to offset the position to center the info div
    const offsetX = (infoRef.current?.offsetWidth || 0) / 2;
    const offsetY = (infoRef.current?.offsetHeight || 0) / 2;

    // Use CSS variables to position the info div instead of state to avoid re-renders
    infoRef.current?.style.setProperty("--x", `${x - offsetX}px`);
    infoRef.current?.style.setProperty("--y", `${y - offsetY}px`);
  }, []);

  useMousePosition(divRef, update);

  return (
    <div className="relative group">
      {/* <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div> */}

      <div
        ref={divRef}
        className="flex-1 h-full  bg-card border  text-card-foreground border-border rounded-3xl  flex-col p-2 overflow-hidden transition-colors duration-300 "
      >
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

      <div
        ref={infoRef}
        style={{
          transform: "translate(var(--x), var(--y))",
        }}
        className="pointer-events-none absolute left-0 top-0 z-50 rounded-full bg-blue-800/80 px-4 py-2 text-sm font-bold text-white opacity-0 duration-0 group-hover:opacity-100"
      >
        View Detail &rarr;
      </div>
    </div>
  );
};
