import { Tab, Tabs, TextField } from '@material-ui/core';
import { CloudUpload, Edit, EditRounded, PageviewRounded } from '@material-ui/icons';
import { EditorChange } from 'codemirror';
import { CodeEditor } from 'components/code_editor';
import { Markdown } from 'components/markdown_parser';
import * as React from 'react';
import { IInstance } from 'react-codemirror2';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { BlogForm, FormModel } from './blog_form';
import { StyledForm } from './styled';

interface PropsInterface extends RouteComponentProps<{id: string}> {}

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
            codeString: '',
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

    handleFormConfirm = (data: FormModel) => {
        console.log('form data', data);
    }

    renderContent = () => {
        const { value, codeString } = this.state;

        switch (value) {
            case 0:
                return (
                    <CodeEditor
                        codeString={codeString}
                        onBeforeChange={this.handleCodeBeforeChange}
                    />
                );
            case 1:
                return (
                    <Markdown
                        markdownString={codeString}
                    />
                );
            case 2:
                return (
                    <div>
                        图片上传
                    </div>
                );
            case 3:
                return (
                    <BlogForm
                        onConfirm={this.handleFormConfirm}
                    />
                );
            default:
                console.error('不存在的tab');
                return null;
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
                    <Tab icon={<CloudUpload />} label='上传图片' />
                    <Tab icon={<Edit />} label='保存' />
                </Tabs>
                <div>
                    {this.renderContent()}
                </div>
            </div>
        );
    }

    componentDidMount() {
        const { match } = this.props;

        console.log('blog_id', match.params.id);
    }
}