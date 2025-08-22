import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as React from "react";
import type { Comment } from "@/lib/config";
import {
  ActivityIcon,
  DotIcon,
  Ellipsis,
  MessageCircle,
  TrashIcon,
} from "lucide-react";

dayjs.extend(relativeTime);

type HeaderProps = {
  comment: Comment;
  handleEditComment: () => void;
  handleDeleteComment: (id: string) => void;
};

const Header = ({
  comment: { id, name, timestamp, isEdited },
  handleEditComment,
  handleDeleteComment,
}: HeaderProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDeleteComment(id);
  };

  const handleEdit = () => {
    handleEditComment();
  };

  return (
    <div className="flex gap-2 items-center">
      <h5 className="mr-2 text-sm font-semibold">{name}</h5>
      <span className="mr-2 text-[0.7rem] text-muted-foreground">
        {dayjs(timestamp).fromNow(true)}
      </span>
      {isEdited && (
        <span className="text-[0.7rem] italic text-muted-foreground">
          edited
        </span>
      )}

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Ellipsis className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuLabel>Operations</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEdit}>
              <MessageCircle size="1.1rem" className="mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <TrashIcon size="1.1rem" className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
