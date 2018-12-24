import { DataTypeProvider } from '@devexpress/dx-react-grid';
import { Switch } from '@material-ui/core';
import * as React from 'react';

const BooleanFormatter = ({ value }: any) => (<Switch checked={value || false}  />);

const BooleanEditorValueChange = (onChange: any) => (event: React.ChangeEvent, checked: boolean) => {
    return onChange(checked);
};

const BooleanEditor = ({value, onValueChange, ...props}: any) => {
    return (
        <Switch
            checked={value || false}
            onChange={BooleanEditorValueChange(onValueChange)}
        />
    );
};

const BooleanTypeProvider = (props: any) => {
    return (
        <DataTypeProvider
            formatterComponent={BooleanFormatter}
            editorComponent={BooleanEditor}
            {...props}
        />
    );
};

export {
    BooleanTypeProvider,
};