import { EditorChange, EditorConfiguration } from 'codemirror';
import * as React from 'react';
import { Controlled as CodeMirror, IInstance } from 'react-codemirror2';
import 'style/code_mirror.scss';
import styled from 'styled-components';

interface PropsInterface {
    codeString: string;
    onBeforeChange: (editor: IInstance, data: EditorChange, value: string) => void;
}

const CodeConfig: EditorConfiguration = {
    mode: 'markdown',
    theme: 'material',
    lineNumbers: true,
};

const Wrapper = styled.div`
    .CodeMirror-scroll {
        background-color: #222;
    }
`;

// 用于编辑文本
export class CodeEditor extends React.PureComponent<PropsInterface> {
    render() {
        const { codeString, onBeforeChange } = this.props;
        return (
            <Wrapper>
                <CodeMirror
                    value={codeString}
                    onBeforeChange={onBeforeChange}
                    options={CodeConfig}
                />
            </Wrapper>
        );
    }
}