import { useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase";
import { cn, formatMonthDay } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "./LikeButton";
import type { Post } from "./PostList";
import { CommentSections } from "./comment-section/CommentSection";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }
  // const displayName = data?.user_metadata.user_name || data?.email;

  return (
    <div
      id="content"
      className={cn(
        "ml-auto w-full max-w-full",
        "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
        "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
        "sm:transition-[width] sm:duration-200 sm:ease-linear",
        "flex h-svh flex-col",
        "group-data-[scroll-locked=1]/body:h-full",
        "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
      )}
    >
      <main className="flex flex-col items-center ">
        <div className="max-w-2xl">
          <h1 className=" text-4xl font-bold mb-6   text-left tracking-tight md:text-3xl">
            {data?.title}
          </h1>
          <div className="flex flex-row gap-2 items-center">
            <img
              src={data?.avatar_url}
              alt="User Avatar"
              className="w-9 h-9 rounded"
            />
            <div className="flex flex-col ">
              <div className="flex flex-row  gap-1 items-center shrink">
                <h1>{data?.op} </h1>
                <span className="mx-1">•</span>
                <p className="text-gray-500 text-sm ">
                  {formatMonthDay(data?.created_at)}
                </p>
              </div>
              <p className="text-gray-500 text-sm ">
                {formatDistanceToNow(new Date(data!.created_at), {
                  addSuffix: false,
                })}
              </p>
            </div>
          </div>

          <div className="py-5">
            {data?.image_url && (
              <img
                src={data.image_url}
                alt={data?.title}
                className=" w-full object-cover rounded "
              />
            )}
          </div>
          <p>{data?.content}</p>
          {/* <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!?.created_at).toLocaleDateString()}
      </p> */}
          <LikeButton postId={postId} className="bg-ring" />
          {/* <CommentSection postId={postId} /> */}
          <CommentSections postId={postId} />
        </div>
      </main>
    </div>
  );
};
