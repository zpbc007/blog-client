import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css';
import * as React from 'react';

interface PropsInterface {
    language: string;
    value: string;
}

export class CodeBlock extends React.PureComponent<PropsInterface> {
    codeRef: React.RefObject<any>;
    constructor(props: PropsInterface) {
        super(props);

        this.codeRef = React.createRef();
    }

    componentDidMount() {
        this.highlightCode();
    }

    componentDidUpdate() {
        this.highlightCode();
    }

    highlightCode() {
        hljs.highlightBlock(this.codeRef.current);
    }

    render() {
        const { language, value } = this.props;
        return (
            <pre>
                <code
                    ref={this.codeRef}
                    className={`language-${language}`}
                >
                    {value}
                </code>
            </pre>
        );
    }
}