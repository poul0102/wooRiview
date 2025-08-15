// app/dashboard/page.js (서버 컴포넌트, 기본이 서버 컴포넌트임)
import React, { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import Card from "@/app/ui/Card";
import Spinner from "./ui/Spinner";

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
      <p className="text-lg font-semibold text-gray-800 my-10">{today}</p>

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
