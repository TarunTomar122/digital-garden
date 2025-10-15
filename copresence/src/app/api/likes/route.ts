import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-admin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    // console.log('Request params:', { id, type });

    if (!id || !type) {
        return NextResponse.json({ error: 'Missing id or type' }, { status: 400 });
    }

    try {
        const docRef = adminDb.collection(`${type}_likes`).doc(id);
        // console.log('Attempting to read document:', `${type}_likes/${id}`);
        
        const docSnap = await docRef.get();
        // console.log('Document exists:', docSnap.exists);

        if (!docSnap.exists) {
            return NextResponse.json({ likes: 0 });
        }

        return NextResponse.json({ likes: docSnap.data()?.count });
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return NextResponse.json({ 
            error: 'Failed to fetch likes',
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { id, type, action } = await request.json();

        if (!id || !type || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const docRef = adminDb.collection(`${type}_likes`).doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            await docRef.set({ count: action === 'like' ? 1 : 0 });
        } else {
            const currentCount = docSnap.data()?.count;
            await docRef.update({
                count: action === 'like' ? currentCount + 1 : Math.max(0, currentCount - 1)
            });
        }

        const updatedDoc = await docRef.get();
        return NextResponse.json({ likes: updatedDoc.data()?.count || 0 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
    }
}