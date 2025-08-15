import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 서버 컴포넌트에서만 사용할 수 있음
export async function requireAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session"); // 예: supabase, custom, 세션 등
    if (!session) {
        redirect("/login"); // 인증 안 되어 있으면 로그인 페이지로 리디렉션
    }

    return session;
}

export async function redirectIfAuthenticated() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (session) {
        redirect("/");
    }
}