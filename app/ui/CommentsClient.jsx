'use client';

import useSWR from 'swr';
import { useAuth } from '../context/AuthContext';
import Comment from './Comment';

const fetcher = (url) => fetch(url, { cache: 'no-store' }).then(r => r.json());

export default function CommentsClient({ postId }) {
    const { user } = useAuth();
    const viewerId = user?.id;

    // 로그인 안 했거나 id 모르면 아무것도 안 보여줌
    if (!viewerId) {
        return (
            <div className="text-gray-500 text-center py-8">
                로그인이 필요합니다.
            </div>
        );
    }

    const key = `/api/${postId}?viewerId=${viewerId}`;
    const { data, isLoading, error, mutate } = useSWR(key, fetcher, {
        revalidateOnFocus: true,
    });

    if (isLoading) {
        return <div className="text-center py-4">댓글을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">댓글을 불러오는데 실패했습니다.</div>;
    }

    const comments = data?.comments ?? [];
    const isPresenter = data?.isPresenter ?? false;

    return (
        <div id="comments">

            {comments.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                    {isPresenter ? '아직 댓글이 없습니다.' : '작성한 댓글이 없습니다.'}
                </div>
            ) : (
                comments.map((c) => (
                    <Comment key={c.id} time={c.created_at} content={c.content} />
                ))
            )}
        </div>
    );
}