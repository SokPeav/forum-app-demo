import { useAuth } from "@/hooks/useAuth";
import { useSignInDialogStore } from "@/hooks/useSignInDialog";
import supabase from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

interface Props {
  postId: number;
  className?: string;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    // Liked -> 0, Like -> -1
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Vote[];
};

export const LikeButton = ({ postId, className }: Props) => {
  const { user } = useAuth();
  const { openDialog } = useSignInDialogStore();
  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    // refetchInterval: 5000,
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) {
        openDialog();
        return Promise.reject(new Error("User not logged in"));
      }
      return vote(voteValue, postId, user.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading) {
    return <div> Loading votes...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  const voteValues = votes?.length === 0 ? "Vote" : likes ? likes : -dislikes;

  return (
    <div className="flex items-center space-x-4 my-4">
      <div className={cn("flex items-center  rounded-2xl gap-1 ", className)}>
        <button
          className={`p-2 rounded-full    hover:text-red-500 hover:bg-gray-800`}
          onClick={() => mutate(1)}
        >
          <ArrowBigUp
            className={`w-5 h-5  ${userVote === 1 && " text-red-500 "}`}
          />
        </button>

        <span className="text-sm font-semibold ">{voteValues}</span>

        <button
          className={`p-2 rounded-full  hover:text-blue-500 hover:bg-gray-800 `}
          onClick={() => mutate(-1)}
        >
          <ArrowBigDown
            className={`w-5 h-5  ${userVote === -1 && "text-blue-500"}`}
          />
        </button>
      </div>
    </div>
  );
};
