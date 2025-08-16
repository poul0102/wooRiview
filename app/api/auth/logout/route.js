import { NextResponse } from "next/server";

export async function POST() {
    // 세션 쿠키 삭제
    const response = NextResponse.json({ success: true });
    response.cookies.set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0), // 즉시 만료
    });

    return response;
}
