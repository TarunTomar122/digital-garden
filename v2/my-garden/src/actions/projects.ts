import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'projects');

interface Link {
    type: string,
    url: string
}

export interface Project {
    id: string,
    title: string,
    description: string,
    category: string,
    date: string,
    content?: string,
    tags: string[],
    links: Link[]
}

export async function getAllProjects() {
    const fileNames = fs.readdirSync(projectsDirectory);

    return fileNames.map((fileName) => {
        const fullPath = path.join(projectsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);

        return {
            id: fileName.replace(/.md$/, ''),
            title: data.title || 'No title',
            description: data.description || 'No description',
            category: data.category || 'No category',
            date: data.date || 'No date',
            tags: data.tags || [],
            links: data.links || [],
            content,
        };
    });
}

export async function getProjectById(id: string): Promise<Project> {
    const fullPath = path.join(projectsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    return {
        id,
        title: data.title || 'No title',
        description: data.description || 'No description',
        category: data.category || 'No category',
        date: data.date || 'No date',
        content,
        tags: data.tags || [],
        links: data.links || []
    };
}