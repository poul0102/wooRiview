'use client'

import React from "react";
import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function PostForm({ postId }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    const res = await fetch(`/api/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    setLoading(false)

    if (res.ok) {
      setContent('')
      router.refresh() //서버 컴포넌트 리렌더링 (댓글 갱신)
    } else {
      alert('댓글 등록에 실패했습니다.')
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
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-10 px-10 rounded-md transition-colors"
      >
        {loading ? '등록 중...' : '등록'}
      </button>
    </form>
  )
}