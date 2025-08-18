import supabase from "@/lib/supabaseClient";

export async function GET(request, { params }) {
  const { postId } = await params;

  try {
    const url = new URL(request.url);
    const viewerId = url.searchParams.get("viewerId");

    // 게시글 + 작성자 정보 조회
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select(`*, users!inner ( name )`)
      .eq("id", postId)
      .single();

    if (postError) {
      return Response.json({ error: postError.message }, { status: 500 });
    }

    // 로그인하지 않은 사용자는 댓글 볼 수 없음
    if (!viewerId) {
      return Response.json({ post, comments: [], isPresenter: false });
    }

    // 로그인한 사용자 정보 조회 (level 확인)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("level")
      .eq("id", viewerId)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return Response.json({ error: userError.message }, { status: 500 });
    }

    // 발표자 여부 확인
    const isPresenter = String(viewerId) === String(post.presenter_id);

    let comments = [];

    if (user.level === 2 || isPresenter) {
      const { data: allComments, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error('All comments fetch error:', commentsError);
        return Response.json({ error: commentsError.message }, { status: 500 });
      }
      comments = allComments || [];
    } else {
      // 일반 사용자는 본인 댓글만 조회
      const { data: myComments, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .eq("author_id", viewerId)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error('My comments fetch error:', commentsError);
        return Response.json({ error: commentsError.message }, { status: 500 });
      }
      comments = myComments || [];
    }

    return Response.json({
      post,
      comments,
      isPresenter,
    });

  } catch (error) {
    console.error('API Error:', error);
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
      content,
      author_id: authorId,
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