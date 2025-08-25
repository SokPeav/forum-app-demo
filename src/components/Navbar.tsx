import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import LogoTitle from "./LogoTitle";
import { ProfileDropdown } from "./profile-dropdown";
import { ThemeSwitch } from "./theme-switch";
import { Button, buttonVariants } from "./ui/button";
export const Navbar = () => {
  const { user } = useAuth();

  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 w-full z-40 bg-background backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <LogoTitle className="hover:bg-blue-400 hover:border-blue-400 mr-4 " />

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-2">
            {topNavLink.map(({ title, href, disabled }) => (
              <Link
                key={`${title}-${href}`}
                to={href}
                disabled={disabled}
                className={cn(
                  `hover:text-primary text-sm font-medium transition-colors ${pathname === href ? "bg-muted hover:bg-muted" : "hover:bg-transparent "}`,
                  buttonVariants({ variant: "ghost" })
                )}
              >
                {title}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            {user && <ProfileDropdown user={user} />}
          </div>

          {/* Mobile Menu Button */}
          <div className="p-1 md:hidden">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <MenuIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start">
                {topNavLink.map(({ title, href, disabled }) => (
                  <DropdownMenuItem key={`${title}-${href}`} asChild>
                    <Link
                      to={href}
                      className={`${pathname === href ? "bg-muted hover:bg-muted" : "hover:bg-transparent "}`}
                      disabled={disabled}
                    >
                      {title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
const topNavLink = [
  {
    title: "Home",
    href: "/",
    isActive: false,
    disabled: false,
  },
  {
    title: " Create Post",
    href: "/create",
    isActive: false,
    disabled: false,
  },
  {
    title: "Communities",
    href: "/communities",
    isActive: false,
    disabled: false,
  },
  {
    title: "  Create Community",
    href: "/community/create",
    isActive: false,
    disabled: false,
  },
];
