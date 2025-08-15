import './globals.css'
import { AuthProvider } from './context/AuthContext'
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="px-4 md:px-20">
        {/* 로그인 전역 상태 유지 */}
        <AuthProvider>
          <Link href={'/'}>
            <header className="flex items-center justify-center gap-3 py-10">
              <img src="/logo.png" alt="Logo" className="h-10" />
              <h1 className="text-2xl font-bold text-blue-800">wooRiview</h1>
            </header>
          </Link>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
