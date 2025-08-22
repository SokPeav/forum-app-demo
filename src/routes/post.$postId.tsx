import { PostDetail } from "@/components/PostDetail";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/post/$postId")({
  component: RouteComponent,
});

function RouteComponent() {
  const postId = useParams({
    from: "/post/$postId",
    select: (params) => params.postId,
  });

  return (
    <>
      <PostDetail postId={Number(postId)} />
    </>
  );
}
