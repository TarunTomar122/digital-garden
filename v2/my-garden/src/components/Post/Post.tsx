
import Image from 'next/image'
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import atomDark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark';
import { Writing } from '@/utils/writingsAPI';

import './styles.css';



SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('html', jsx);
SyntaxHighlighter.registerLanguage('css', css);

function PostContent({ postData }: { postData: Writing }) {

    const { content } = postData;

    const customRenderers = {
        code(code) {
            const { className, children } = code;
            if (className === undefined) {
                return <code className="inline-code">{children}</code>;
            }
            const language = className.split('-')[1]; // className is something like language-js => We need the "js" part here
            return (
                <SyntaxHighlighter
                    style={atomDark}
                    language={language}>
                    {children}
                </SyntaxHighlighter>
            );
        }
    };

    return (
        <div className='markdown'>
            <ReactMarkdown components={customRenderers}>{content}</ReactMarkdown>
        </div>
    )
}

export default PostContent
