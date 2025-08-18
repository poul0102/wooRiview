import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(req) {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.user) {
        return NextResponse.json({ ok: false, message: error?.message || "로그인 실패" }, { status: 401 });
    }

    const response = NextResponse.json({ 
        ok: true,
        user: data.user,
    });

    response.cookies.set({
        name: "session",
        value: data.session?.access_token || "",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
    });

    return response;
}
