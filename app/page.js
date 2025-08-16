import React, { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import Card from "@/app/ui/Card";
import Spinner from "./ui/Spinner";
import LogoutButton from "./ui/LogoutButton";
import CreatePostButton from "@/app/ui/CreatePostButton";

async function getPosts() {
  const res = await fetch("http://localhost:3000/api", {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data;
}

export default async function DashboardPage() {
  await requireAuth();

  const posts = await getPosts();

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <>
      <div className="flex justify-end mb-4 pr-4">
        <LogoutButton />
      </div>
      <div className="flex justify-between items-center mb-4 pr-4">
        <p className="text-lg font-semibold text-gray-800 pl-4">{today}</p>
        <CreatePostButton />
      </div>

      <Suspense fallback={<Spinner />}>
        {posts.map((post) => (
          <Card
            key={post.id}
            post={post}
            presenter={post.users.name}
            commentCount={post.commentCount}
          />
        ))}
      </Suspense>
    </>
  );
}
