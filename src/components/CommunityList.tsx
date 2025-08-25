import supabase from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}
export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading)
    return <div className="text-center py-4">Loading communities...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );

  return (
    <figure
      className={cn(
        "relative flex h-[500px]max-w-5xl mx-auto  flex-col overflow-hidden p-2 space-y-4 "
      )}
    >
      {data?.map((community) => (
        <Link
          to={`/community/$communityId`}
          params={{
            communityId: community.id.toString(),
          }}
          key={community.id}
          className={cn(
            "relative mx-auto min-h-fit w-full max-w-[800px] cursor-pointer overflow-hidden rounded-2xl p-4",
            "transition-all duration-200 ease-in-out hover:scale-[103%]",
            "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
          )}
        >
          <div className="flex flex-col gap-3">
            <figcaption className="flex flex-row items-center text-lg font-medium  ">
              <span className="text-sm sm:text-lg"> {community.name}</span>
            </figcaption>
            <span className="text-gray-400 mt-2">{community.description}</span>
          </div>
        </Link>
      ))}
    </figure>
  );
};
