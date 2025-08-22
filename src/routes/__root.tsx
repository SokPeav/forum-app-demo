import type { User } from "@supabase/supabase-js";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navbar } from "../components/Navbar";
import { AuthDialog } from "@/components/AuthDialog";

export const Route = createRootRouteWithContext<{ auth: User | null }>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen  transition-opacity duration-700 pt-20">
      <Navbar />
      <div className=" container mx-auto px-6 py-6 ">
        <Outlet />
      </div>
      <AuthDialog />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
