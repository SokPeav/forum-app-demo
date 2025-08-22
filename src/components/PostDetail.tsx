import { useQuery } from "@tanstack/react-query";
// import { CommentSection } from "./CommentSection";
import type { Post } from "./PostList";
import supabase from "@/lib/supabase";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { CommentSections } from "./comment-section/CommentSection";
import dayjs from "dayjs";
import { formatDistanceToNow } from "date-fns";

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

  console.log(data);
  return (
    <div className="space-y-6">
      {/* <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data?.title}
      </h2> */}
      <div className="flex flex-row gap-2 items-center ">
        <img
          src={data?.avatar_url}
          alt="User Avatar"
          className="w-9 h-9 rounded object-cover"
        />
        <div className="flex items-center shrink ">
          <h1>{data?.op} </h1>
          <span className="mx-1">.</span>
          <p className="text-gray-500 text-sm ">
            {formatDistanceToNow(new Date(data!.created_at), {
              addSuffix: false,
            })}
          </p>
        </div>
      </div>
      <h1 className="text-neutral-content-strong m-0 font-semibold text-18 xs:text-24  mb-xs px-md xs:px-0 xs:mb-md  overflow-hidden">
        {data?.title}
      </h1>
      {data?.image_url && (
        <figure className="h-full w-full m-0 z-10 flex items-center">
          <img
            src={data.image_url}
            alt={data?.title}
            className="media-lightbox-img h-full  max-h-[100vw] object-contain mb-0 relative"
            sizes="(min-width: 1415px) 750px, (min-width: 768px) 50vw, 100vw"
          />
        </figure>
      )}
      <p className="text-gray-400">{data?.content}</p>
      {/* <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!?.created_at).toLocaleDateString()}
      </p> */}
      <LikeButton postId={postId} className="bg-gray-800" />
      {/* <CommentSection postId={postId} /> */}
      <CommentSections postId={postId} />
    </div>
  );
};
