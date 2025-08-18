// app/dashboard/[postId]/page.js
import { Suspense } from "react";
import PostForm from "../ui/PostForm";
import Spinner from "../ui/Spinner";
import CommentsClient from "../ui/CommentsClient"; 

async function getPostData(postId) {
  const res = await fetch(`http://localhost:3000/api/${postId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch post data");
  return res.json();
}

export default async function PostIdPage({ params }) {
  const { postId } = await params;

  try {
    const { post } = await getPostData(postId);

    return (
      <>
        <div className="my-10">
          <p className="font-bold">
            <span className="font-bold text-xl mb-4">{post.topic}</span>
            {` - ${post.users.name}`}
          </p>
        </div>

        <PostForm postId={postId} />

        {/* 댓글 데이터 Suspense로 streaming 처리 */}
        <Suspense fallback={<Spinner />}>
          <CommentsClient postId={postId} />
        </Suspense>
      </>
    );
  } catch (error) {
    return (
      <div className="my-10">
        <p className="text-red-500">
          게시글을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }
}
