'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '../Button'
import { validateEmail, validatePassword } from './SingupValidation'
import supabase from '../../lib/supabaseClient'
import bcrypt from 'bcryptjs'

export default function SignupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const isEmailValid = validateEmail(email)
  const isPwValid = validatePassword(pw)
  const isCodeValid = code === 'woori1234'

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!name || !email || !pw || !code) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    if (!isEmailValid || !isPwValid) {
      setError('입력값을 다시 확인해주세요.')
      return
    }

    if (!isCodeValid) {
      setError('인증코드가 올바르지 않습니다.')
      return
    }

    try {
      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(pw, 10)

      // Supabase Auth에 등록 
      // Supabase에 자동으로 생성되있는 테이블
      // 사용자 로그인, 회원가입시 자동기록
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: pw,
      })

      if (signUpError) {
        console.error(signUpError)
        setError('회원가입 실패: ' + signUpError.message)
        return
      }

      const userId = authData?.user?.id
      if (!userId) {
        setError('회원가입 중 오류가 발생했습니다.')
        return
      }

      // Supabase RDB(users 테이블)에 추가 정보 저장
      // 사용자 정보 기록
      const { error: dbError } = await supabase.from('users').insert({
        id: userId,
        name,
        email,
        password: hashedPassword,
        level: 1,
      })

      if (dbError) {
        console.error(dbError)
        setError('회원정보 저장 중 오류가 발생했습니다.')
        return
      }

      alert('회원가입 완료!')
      router.push('/login')
    } catch (err) {
      console.error(err)
      setError('회원가입 실패: ' + signUpError.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white border border-gray-300 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">회원가입</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {email && !isEmailValid && (
              <p className="text-red-500 text-sm mt-1">올바른 이메일 형식을 입력해주세요.</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {pw && !isPwValid && (
              <p className="text-red-500 text-sm mt-1">
                비밀번호는 8~16자, 영문/숫자/특수문자를 포함해야 합니다.
              </p>
            )}
          </div>

          <input
            type="text"
            placeholder="인증코드"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button type="submit">회원가입</Button>

          <Link
            href="/login"
            className="block text-center text-sm text-blue-400 hover:underline"
          >
            로그인으로 돌아가기
          </Link>
        </form>
      </div>
    </div>
  )
}
