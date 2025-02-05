'use client';

import Link from 'next/link';
import { Writing } from '@/utils/writingsAPI';

interface WritingsListProps {
    writings: Writing[];
}

export default function WritingsList({ writings }: WritingsListProps) {
    return (
        <section className="pb-8">
            {writings.map((writing) => (
                <article key={writing.id} className="py-8 border-b border-gray-400 border-opacity-40">
                    <Link href={`/writings/${writing.id}`}>
                        <h2 className="text-2xl text-slate-200 hover:text-slate-300 transition-colors duration-200">
                            {writing.title}
                        </h2>
                    </Link>
                    <p className="text-slate-400 mt-2">{writing.description}</p>
                    <div className="flex gap-4 mt-4 text-sm text-slate-500">
                        <span>{writing.category}</span>
                        <span>{writing.date}</span>
                    </div>
                </article>
            ))}
        </section>
    );
}