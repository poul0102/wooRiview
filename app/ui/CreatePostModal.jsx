'use client'
import { useState, useEffect } from 'react'
import supabase from '@/lib/supabaseClient'

export default function CreatePostModal({ isOpen, onClose, onCreated }) {
    const [topic, setTopic] = useState('')
    const [presenterId, setPresenterId] = useState('')
    const [users, setUsers] = useState([])

    useEffect(() => {
        // 발표자 목록 가져오기
        const fetchUsers = async () => {
            const { data } = await supabase.from('users').select('id, name')
            setUsers(data || [])
        }
        if (isOpen) fetchUsers()
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { error } = await supabase.from('posts').insert({
            topic,
            presenter_id: presenterId,
            created_at: new Date().toISOString(),
        })

        if (error) {
            alert('게시글 생성 실패: ' + error.message)
        } else {
            onCreated()
            onClose()
            setTopic('')
            setPresenterId('')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 backdrop-blur md-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">게시글 생성</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="발표 제목"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full border px-4 py-2 rounded"
                        required
                    />

                    <select
                        value={presenterId}
                        onChange={(e) => setPresenterId(e.target.value)}
                        className="w-full border px-4 py-2 rounded"
                        required
                    >
                        <option value="">발표자 선택</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            등록
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}