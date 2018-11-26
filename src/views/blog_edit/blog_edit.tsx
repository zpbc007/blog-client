import { Tab, Tabs } from '@material-ui/core';
import { EditRounded, PageviewRounded } from '@material-ui/icons';
import { EditorChange } from 'codemirror';
import { CodeEditor } from 'components/code_editor';
import { Markdown } from 'components/markdown_parser';
import * as React from 'react';
import { IInstance } from 'react-codemirror2';
import styled from 'styled-components';

interface PropsInterface {}

interface StateInterface {
    codeString: string;
    value: number;
}

const StyledCodeEditor = styled(CodeEditor)`
    flex: auto;
`;
const StyledMarkdown = styled(Markdown)`
    flex: auto;
`;

/**
 * 博客编辑页面
 */
export class BlogEdit extends React.PureComponent<PropsInterface, StateInterface> {
    constructor(props: any) {
        super(props);

        this.state = {
            codeString: '123qwe',
            value: 0,
        };
    }

    handleCodeBeforeChange = (editor: IInstance, data: EditorChange, value: string) => {
        this.setState({
            codeString: value,
        });
    }

    handleTabChange = (event: any, value: number) => {
        this.setState({
            value,
        });
    }

    renderContent = () => {
        const { value, codeString } = this.state;

        if (value === 0) {
            return (
                <CodeEditor
                    codeString={codeString}
                    onBeforeChange={this.handleCodeBeforeChange}
                />
            );
        } else {
            return (
                <Markdown
                    markdownString={codeString}
                />
            );
        }
    }

    render() {
        const {
            value,
        } = this.state;

        return (
            <div>
                <Tabs
                    value={value}
                    onChange={this.handleTabChange}
                    indicatorColor='secondary'
                    textColor='secondary'
                >
                    <Tab icon={<EditRounded />} label='编辑' />
                    <Tab icon={<PageviewRounded />} label='预览' />
                </Tabs>
                <div>
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}