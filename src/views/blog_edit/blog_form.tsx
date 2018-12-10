import { Button, TextField } from '@material-ui/core';
import * as React from 'react';
import { SchemaModel, StringType } from 'rsuite-schema';

interface CheckResult {
    hasError: boolean;
    errorMessage?: string;
}

interface PropsInterface {
    onConfirm: (data: FormModel) => void;
}

export interface FormModel {
    title: string;
}

interface StateInterface {
    model: any;
    formError: {
        title: CheckResult;
    };
    form: FormModel;
}

export class BlogForm extends React.PureComponent<PropsInterface, StateInterface> {
    constructor(props: any) {
        super(props);

        this.state = {
            model: SchemaModel({
                title: StringType()
                    .minLength(1, '不能少于1位')
                    .maxLength(100, '不能大于50位')
                    .isRequired('标题不能为空'),
            }),
            form: {
                title: '',
            },
            formError: {
                title: { hasError: false },
            },
        };
    }

    handleFieldChange = ({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
        const field = currentTarget.getAttribute('data-field') as string,
            value = currentTarget.value;
        const { model, formError, form } = this.state;

        const checkResult = model.checkForField(field, value);

        this.setState({
            form: {
                ...form,
                [field]: value,
            },
            formError: {
                ...formError,
                [field]: checkResult,
            },
        });
    }

    handleSave = () => {
        const { onConfirm } = this.props;

        onConfirm && onConfirm({
            ...this.state.form,
        });
    }

    render() {
        const { form, formError } = this.state;
        return (
            <div>
                <TextField
                    label='标题'
                    required={true}
                    inputProps={{
                        'data-field': 'title',
                    }}
                    onChange={this.handleFieldChange}
                    value={form.title}
                    error={formError.title.hasError}
                    helperText={formError.title.errorMessage}
                />
                <Button onClick={this.handleSave} >
                    保存
                </Button>
            </div>
        );
    }
}