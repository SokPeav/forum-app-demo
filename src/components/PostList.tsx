import supabase from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { PostItem } from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
  op?: string;
}
const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);

  return data as Post[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* <div className="flex flex-wrap gap-6 justify-center"> */}
      {data?.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  );
};
