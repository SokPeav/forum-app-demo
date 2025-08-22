import { createFileRoute } from "@tanstack/react-router";
import { CreatePost } from "../components/CreatePost";

export const Route = createFileRoute("/create")({
  component: CreatePostRouteComponent,
});

function CreatePostRouteComponent() {
  return (
    <>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Post
      </h2>
      <CreatePost />
    </>
  );
}
