'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const writingsDirectory = path.join(process.cwd(), 'writings');

export interface Writing {
    id: string,
    title: string,
    description: string,
    category: string,
    date: string,
    content: string,
}

export async function getAllWritings() {
    const fileNames = fs.readdirSync(writingsDirectory);

    return fileNames.map((fileName) => {
        const fullPath = path.join(writingsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data } = matter(fileContents);

        return {
            id: fileName.replace(/.md$/, ''),
            title: data.title || 'No title',
            description: data.description || 'No description',
            category: data.category || 'No category',
            date: data.date || 'No date',
        };
    });
}

export async function getWritingById(id: string): Promise<Writing> {
    const fullPath = path.join(writingsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    return {
        id,
        title: data.title || 'No title',
        description: data.description || 'No description',
        category: data.category || 'No category',
        date: data.date || 'No date',
        content,
    };
}