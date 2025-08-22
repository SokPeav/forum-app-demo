import { ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

type ActionProps = {
  like: number;
  id: number;
  showInput: () => void;
};

const Actions = ({ id, like, showInput }: ActionProps) => {
  const [count, setCount] = useState(like);

  const onCountUpdate = (type: string) => {
    switch (type) {
      case "inc":
        setCount((prevCount) => ++prevCount);
        break;
      case "dec":
        if (count === 0) return;
        setCount((prevCount) => --prevCount);
        break;
      default:
        return;
    }

    let tempCount = like;
  };
  const [userVote, setVote] = useState("");
  return (
    <div className="flex gap-5 items-center ">
      {/* Upvote/Downvote column */}
      <div className="flex items-center ">
        <button
          className={`p-1 rounded-full hover:text-red-500 hover:bg-gray-200 ${
            userVote === "up" ? "text-orange-500" : "text-gray-500"
          }`}
          onClick={() => setVote("up")}
        >
          <ArrowBigUp className="w-5 h-5" />
        </button>

        <span className="text-sm font-semibold">{count}</span>

        <button
          className={`p-1 rounded-full  hover:text-blue-500 hover:bg-gray-200 ${
            userVote === "down" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => setVote("down")}
        >
          <ArrowBigDown className="w-5 h-5" />
        </button>
      </div>

      {/* Reply button */}
      <button
        className="flex gap-2 items-center text-gray-500  cursor-pointer"
        onClick={showInput}
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm">Reply</span>
      </button>
    </div>
  );
};

export default Actions;
