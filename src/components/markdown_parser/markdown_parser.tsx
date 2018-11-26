import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './code_block';
import './index.scss';

interface PropsInterface {
    markdownString: string;
}

/**
 * 用于显示markdown
 */
export class Markdown extends React.PureComponent<PropsInterface> {
    render() {
        const { markdownString } = this.props;
        return (
            <div className='markdown-parser'>
                <ReactMarkdown
                    source={markdownString}
                    escapeHtml={false}
                    renderers={{
                        code: CodeBlock,
                    }}
                />
            </div>
        );
    }
}