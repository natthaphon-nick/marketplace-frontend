import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // We can't access localStorage in middleware because it runs on the server.
    // Real security would use HttpOnly cookies.
    // For now, let's keep it simple and just allow the request.

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/register',
        '/profile',
    ],
};
