import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface LogoTitleProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function LogoTitle({ className }: LogoTitleProps) {
  return (
    <div
      className={cn(
        "max-h-fit transform rounded-full  p-2 px-6 transition-all duration-500 ease-out hover:-rotate-2 hover:scale-110 hover:text-white hover:shadow-xl",
        className
      )}
    >
      <Link to="/" className="font-mono text-xl font-bold ">
        forum<span className="text-purple-500">.app</span>
      </Link>
    </div>
  );
}
