'use client'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import atomDark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark';
import { Writing } from '@/actions/writingsActions';
import type { Components } from 'react-markdown';
import { useEffect } from 'react';

import './styles.css';

SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('html', jsx);
SyntaxHighlighter.registerLanguage('css', css);

// Helper function to extract image URLs from markdown content
function extractImageUrls(markdown: string): string[] {
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    const matches = [...markdown.matchAll(imageRegex)];
    return matches.map(match => match[1]);
}

function PostContent({ postData }: { postData: Writing }) {
    const { content } = postData;

    // Prefetch images when component mounts
    useEffect(() => {
        const imageUrls = extractImageUrls(content);
        imageUrls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
        });
    }, [content]);

    const customRenderers: Components = {
        img: (props) => {
            const { src, alt } = props;
            return (
                <div className="my-4">
                    <Image
                        src={src || ''}
                        alt={alt || 'Post image'}
                        width={800}
                        height={400}
                        className="rounded-lg w-full h-auto"
                        style={{ maxWidth: '100%', height: 'auto' }}
                        loading="eager" // Let Next.js handle the loading strategy
                        quality={85} // Good balance between quality and size
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                </div>
            );
        },
        code(props) {
            const { className, children } = props;
            if (className === undefined) {
                return <code className="inline-code">{children}</code>;
            }
            const language = className.split('-')[1];
            return (
                <SyntaxHighlighter
                    style={atomDark}
                    language={language || 'text'}>
                    {Array.isArray(children) ? children.join('') : children || ''}
                </SyntaxHighlighter>
            );
        }
    };

    return (
        <div>
            <div className='markdown'>
                <ReactMarkdown components={customRenderers}>{content}</ReactMarkdown>
            </div>
        </div>
    )
}

export default PostContent;
