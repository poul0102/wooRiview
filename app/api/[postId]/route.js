// app/api/dashboard/[postId]/route.js
import supabase from "@/lib/supabaseClient";

export async function GET(request, { params }) {
  const { postId } = await params;

  try {
    // 1) 특정 게시글 정보 + 발표자 이름 조회
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select(
        `
        *,
        users!inner (
          name
        )
      `
      )
      .eq("id", postId)
      .single();

    if (postError) {
      return Response.json({ error: postError.message }, { status: 500 });
    }

    // 2) 해당 게시글의 댓글들 조회
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (commentsError) {
      return Response.json({ error: commentsError.message }, { status: 500 });
    }

    return Response.json({
      post: post,
      comments: comments
    });

  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {

  const { postId } = await params;
  const { content, authorId } = await req.json();

  if (!content || !postId || !authorId) {
    return Response.json({ error: '내용을 작성해주세요' }, { status: 400 });
  }

  try {
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_id: authorId,
      content,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('댓글 등록 오류:', error);
    return Response.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}