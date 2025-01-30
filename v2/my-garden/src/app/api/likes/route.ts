import { NextResponse } from 'next/server';
import { db } from '@/utils/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
        return NextResponse.json({ error: 'Missing id or type' }, { status: 400 });
    }

    try {
        const docRef = doc(db, `${type}_likes`, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ likes: 0 });
        }

        return NextResponse.json({ likes: docSnap.data().count });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { id, type, action } = await request.json();

        if (!id || !type || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const docRef = doc(db, `${type}_likes`, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, { count: action === 'like' ? 1 : 0 });
        } else {
            const currentCount = docSnap.data().count;
            await updateDoc(docRef, {
                count: action === 'like' ? currentCount + 1 : Math.max(0, currentCount - 1)
            });
        }

        const updatedDoc = await getDoc(docRef);
        return NextResponse.json({ likes: updatedDoc.data()?.count || 0 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
    }
}