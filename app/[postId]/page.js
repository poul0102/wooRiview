// app/dashboard/[postId]/page.js
import { Suspense } from "react";
import PostForm from "../ui/PostForm";
import Comment from "../ui/Comment";
import Spinner from "../ui/Spinner";

async function getPostData(postId) {
  const res = await fetch(`http://localhost:3000/api/${postId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post data");
  }

  const json = await res.json();
  return json;
}

async function Comments({ postId }) {
  const { comments } = await getPostData(postId);

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          time={comment.created_at}
          content={comment.content}
        />
      ))}
    </div>
  );
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

        <PostForm />

        {/* 댓글 데이터 Suspense로 streaming 처리 */}
        <Suspense fallback={<Spinner />}>
          <Comments postId={postId} />
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
