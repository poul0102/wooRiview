import supabase from "@/lib/supabaseClient";

export async function GET() {
  // 오늘 날짜 문자열 생성 (YYYY-MM-DD)
  const today = new Date()
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split(". ")
    .join("-")
    .slice(0, 10);

  // 1) 오늘 날짜 게시글 + 발표자 이름(users.name) 조회
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select(
      `
      *,
      users!inner (
        name
      )
    `
    )
    .eq("created_at", today);

  if (postsError) {
    return Response.json({ error: postsError.message }, { status: 500 });
  }

  // 게시글 id 배열 추출
  const postIds = posts.map((post) => post.id);

  // 2) 해당 게시글들의 댓글(post_id) 조회
  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("post_id")
    .in("post_id", postIds);

  if (commentsError) {
    return Response.json({ error: commentsError.message }, { status: 500 });
  }

  // 3) 댓글 수 집계
  const commentCountMap = comments.reduce((acc, comment) => {
    acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
    return acc;
  }, {});

  // 4) 게시글에 댓글 수 붙이기
  const postsWithCommentCount = posts.map((post) => ({
    ...post,
    commentCount: commentCountMap[post.id] || 0,
  }));

  return Response.json({ data: postsWithCommentCount });
}
