import { DataTypeProvider } from '@devexpress/dx-react-grid';
import { Button } from '@material-ui/core';
import * as React from 'react';

interface ActionItem {
    text: string;
    onClick: () => void;
}

const ActionFormatter = ({ value = [] }: { value: ActionItem[] }) => {
    return (value.map(({ text, onClick }, index) => {
        return (
            <Button
                key={`${text}-${index}`}
                onClick={onClick}
                variant='contained'
                color='primary'
            >
                {text}
            </Button>
        );
    }));
};

const ActionEditor = () => null;

const ActionTypeProvider = (props: any) => (
    <DataTypeProvider
        formatterComponent={ActionFormatter}
        editorComponent={ActionEditor}
        {...props}
    />
);

export {
    ActionTypeProvider,
};