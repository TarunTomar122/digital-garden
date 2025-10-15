import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const writingsDirectory = path.join(process.cwd(), 'writings');

export async function GET() {
    try {
        const fileNames = fs.readdirSync(writingsDirectory);

        const writings = fileNames.map((fileName) => {
            const fullPath = path.join(writingsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            const { data } = matter(fileContents);

            return {
                id: fileName.replace(/\.md$/, ''),
                title: data.title || 'No title',
                description: data.description || 'No description',
                category: data.category || 'No category',
                date: data.date || 'No date',
            };
        });

        return NextResponse.json({ writings });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch writings' }, { status: 500 });
    }
}