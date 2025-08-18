import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import supabase from "./supabaseClient";

// 서버 컴포넌트에서만 사용할 수 있음
export async function requireAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session"); // 쿠키 가져오기
    if (!session) {
        redirect("/login"); // 인증 안 되어 있으면 로그인 페이지로 리디렉션
    }

    const { data: { user }, error } = await supabase.auth.getUser(session.value); // session.value 사용

    if (error || !user) {
        redirect("/login");
    }

    return user; // user.id, user.email 등 사용 가능
}

export async function redirectIfAuthenticated() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (session) {
        redirect("/");
    }
}
