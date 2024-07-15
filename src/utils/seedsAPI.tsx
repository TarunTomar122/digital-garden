import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const seedsDirectory = path.join(process.cwd(), 'seeds');

export interface Seed {
    id: string,
    title: string,
    description: string,
    category: string,
    date: string,
    content: string,
}

export function getAllSeeds() {
    const fileNames = fs.readdirSync(seedsDirectory);

    return fileNames.map((fileName) => {
        const fullPath = path.join(seedsDirectory, fileName);
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
}

export function getSeedById(id: string): Seed {
    const fullPath = path.join(seedsDirectory, `${id}.md`);
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
