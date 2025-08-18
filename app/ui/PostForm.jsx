'use client'

import React from "react";
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { useSWRConfig } from 'swr'

export default function PostForm({ postId }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    try {
      const res = await fetch(`/api/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorId: user.id }),
      })

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: '댓글 등록 실패' }))
        throw new Error(error || '댓글 등록에 실패했습니다.')
      }

      // 입력창 초기화
      setContent('')

      // 1) 댓글 리스트만 즉시 최신화 (발표자/일반 사용자 필터링된 GET 키)
      mutate(`/api/${postId}?viewerId=${user.id}`)

      // 2) RSC도 재검증(페이지 전체 수동 새로고침 아님)
      router.refresh()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <textarea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow h-25 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        required
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-10 px-10 rounded-md transition-colors disabled:opacity-60"
      >
        {loading ? '등록 중...' : '등록'}
      </button>
    </form>
  )
}