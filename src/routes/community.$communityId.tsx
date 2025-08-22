import { CommunityDisplay } from "@/components/CommunityDisplay";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/community/$communityId")({
  component: RouteComponent,
});

function RouteComponent() {
  const communityId = useParams({
    from: "/community/$communityId",
    select: (params) => params.communityId,
  });
  return (
    <>
      <CommunityDisplay communityId={Number(communityId)} />
    </>
  );
}
