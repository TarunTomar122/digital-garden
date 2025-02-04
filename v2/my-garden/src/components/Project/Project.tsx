'use client'

import Image from 'next/image'
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import atomDark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark';
import { Project } from '@/actions/projects';
import type { Components } from 'react-markdown';

import './styles.css';

SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('html', jsx);
SyntaxHighlighter.registerLanguage('css', css);

function ProjectContent({ projectData }: { projectData: Project }) {
    const { content } = projectData;

    const customRenderers: Components = {
        img: (props) => {
            const { src, alt } = props;
            return (
                <div className="my-4">
                    <Image
                        src={src || ''}
                        alt={alt || 'Project image'}
                        width={800}
                        height={400}
                        className="rounded-lg w-full h-auto"
                        style={{ maxWidth: '100%', height: 'auto' }}
                        loading="lazy"
                        quality={85}
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
                {content && <ReactMarkdown components={customRenderers}>{content}</ReactMarkdown>}
            </div>
        </div>
    )
}

export default ProjectContent;
