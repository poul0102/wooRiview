import React, { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import Card from "@/app/ui/Card";
import Spinner from "./ui/Spinner";
import LogoutButton from "./ui/LogoutButton";
import CreatePostButton from "@/app/ui/CreatePostButton";
// import supabase from "@/lib/supabaseClient";

async function getPosts() {
  const res = await fetch("http://localhost:3000/api", {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data;
}

// async function getCurrentUser(userId) {
//   const { data, error } = await supabase
//     .from("users")
//     .select("level")
//     .eq("id", userId)
//     .single();

//   if (error) {
//     console.error(error);
//     return null;
//   }

//   return data;
// }

export default async function DashboardPage() {
  const user = await requireAuth();
  // const currentUser = await getCurrentUser(user.id);

  const posts = await getPosts();

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <>
      <div className="flex justify-between items-center mb-4 pr-4 pl-4">
        <p className="text-lg font-semibold text-gray-800">{today}</p>
        <div className="flex items-center space-x-2">
          {/* {currentUser?.level === 2 && <CreatePostButton />} */}
          <CreatePostButton />
          <LogoutButton />
        </div>
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
