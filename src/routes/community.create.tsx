import { CreateCommunity } from "@/components/CreateCommunity";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/community/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>
      <CreateCommunity />
    </>
  );
}
