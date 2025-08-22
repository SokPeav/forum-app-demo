import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { PostList } from "@/components/PostList";
import { useSignInDialogStore } from "@/hooks/useSignInDialog";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { openDialog } = useSignInDialogStore();

  return (
    <>
      <button
        onClick={openDialog}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Sign in
      </button>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Recent Posts
      </h2>
      <PostList />
      {/* <AnimatedGridPattern /> */}
    </>
  );
}
