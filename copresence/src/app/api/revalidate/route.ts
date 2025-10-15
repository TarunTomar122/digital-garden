import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        revalidateTag('spotify-embed');
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (error) {
        return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
    }
} 