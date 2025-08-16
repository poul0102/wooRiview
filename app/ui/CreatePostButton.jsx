'use client'

import { useState } from 'react'
import CreatePostModal from './CreatePostModal'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

export default function CreatePostButton() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handleCreated = () => {
        setIsOpen(false)
        router.refresh()
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="!w-auto px-4 py-2"
            >
                게시글 생성
            </Button>

            <CreatePostModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onCreated={handleCreated}
            />
        </>
    )
}