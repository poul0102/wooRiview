import React from "react";
import Link from "next/link";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

const Card = ({ post, presenter, commentCount }) => {
  return (
    <Link href={`${post.id}`}>
      <div className="border border-gray-200 shadow-md rounded-2xl p-6 m-3 bg-white hover:shadow-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {post.topic}
        </h3>
        <p className="text-sm text-gray-500 mt-4 gap-4">발표자: {presenter}</p>
        <p className="text-gray-500 mt-5 flex items-center gap-1">
          <ChatBubbleLeftIcon className="w-5 h-5" />
          {commentCount}
        </p>
      </div>
    </Link>
  );
};

export default Card;
